#!/usr/bin/env python3
"""
Smart Farm AI - Satellite Processing Script
Computes NDVI-based crop damage assessment using Rasterio and GeoPandas.

Usage:
    python process_satellite.py <before_tif> <after_tif> <geojson_polygon> <output_dir>

Outputs to output_dir:
    - damage_map.png     : Color-coded damage map (Red=Severe, Yellow=Moderate, Green=Healthy)
    - stats.json         : NDVI statistics and damage breakdown

Requirements:
    pip install rasterio numpy geopandas shapely pillow
"""

import sys
import os
import json
import numpy as np

try:
    import rasterio
    from rasterio.mask import mask as rasterio_mask
    from rasterio.warp import calculate_default_transform, reproject, Resampling
    from shapely.geometry import shape, mapping
    import geopandas as gpd
    from PIL import Image
    HAS_DEPS = True
except ImportError as e:
    print(json.dumps({"error": f"Missing dependency: {e}. Install: pip install rasterio geopandas shapely pillow"}))
    HAS_DEPS = False


def load_and_clip_band(tif_path: str, geojson_polygon: dict, band_index: int = 1) -> tuple:
    """
    Opens a GeoTIFF and clips it to the given GeoJSON polygon.
    Returns (data_array, profile).
    """
    with rasterio.open(tif_path) as src:
        # Convert GeoJSON polygon to shapely, then reproject to raster CRS
        polygon = shape(geojson_polygon)
        gdf = gpd.GeoDataFrame({'geometry': [polygon]}, crs='EPSG:4326')
        gdf = gdf.to_crs(src.crs)

        # Clip raster to polygon
        out_image, out_transform = rasterio_mask(src, gdf.geometry, crop=True, filled=True, nodata=np.nan)
        out_profile = src.profile.copy()
        out_profile.update({
            "driver": "GTiff",
            "height": out_image.shape[1],
            "width": out_image.shape[2],
            "transform": out_transform,
        })
        return out_image[band_index - 1], out_profile


def compute_ndvi(nir_band: np.ndarray, red_band: np.ndarray) -> np.ndarray:
    """
    Computes NDVI = (NIR - Red) / (NIR + Red).
    Returns array with values in [-1, 1], NaN for invalid pixels.
    """
    np.seterr(divide='ignore', invalid='ignore')
    nir = nir_band.astype(np.float32)
    red = red_band.astype(np.float32)
    denominator = nir + red
    ndvi = np.where(denominator == 0, np.nan, (nir - red) / denominator)
    return ndvi


def classify_damage(ndvi_before: np.ndarray, ndvi_after: np.ndarray,
                    moderate_drop: float = 0.2, severe_drop: float = 0.4) -> np.ndarray:
    """
    Classifies each pixel based on NDVI drop between before and after images.
    Returns classification array:
        0 = No data / masked
        1 = Healthy (low NDVI drop)
        2 = Moderate damage
        3 = Severe damage
    """
    drop = ndvi_before - ndvi_after
    classification = np.zeros_like(drop, dtype=np.uint8)

    valid = ~(np.isnan(ndvi_before) | np.isnan(ndvi_after))
    classification[valid & (drop < moderate_drop)] = 1  # Healthy
    classification[valid & (drop >= moderate_drop) & (drop < severe_drop)] = 2  # Moderate
    classification[valid & (drop >= severe_drop)] = 3  # Severe

    return classification


def create_damage_map(classification: np.ndarray, output_path: str) -> None:
    """
    Creates an RGBA damage map PNG from classification array.
    Colors: Green=Healthy, Yellow=Moderate, Red=Severe, Transparent=NoData
    """
    h, w = classification.shape
    rgba = np.zeros((h, w, 4), dtype=np.uint8)

    # Transparent for no-data
    # Green for healthy
    mask_healthy = classification == 1
    rgba[mask_healthy] = [34, 197, 94, 200]  # green-500 with alpha

    # Yellow for moderate
    mask_moderate = classification == 2
    rgba[mask_moderate] = [234, 179, 8, 200]  # yellow-500 with alpha

    # Red for severe
    mask_severe = classification == 3
    rgba[mask_severe] = [239, 68, 68, 200]  # red-500 with alpha

    img = Image.fromarray(rgba, mode='RGBA')
    img.save(output_path)


def compute_pixel_area_acres(profile: dict) -> float:
    """Estimates the area of a single pixel in acres based on transform."""
    transform = profile.get('transform')
    if transform is None:
        return 0.0
    pixel_width_m = abs(transform.a)
    pixel_height_m = abs(transform.e)
    area_sqm = pixel_width_m * pixel_height_m
    return area_sqm / 4046.8564224  # to acres


def process(before_tif: str, after_tif: str, geojson_polygon_str: str, output_dir: str) -> dict:
    """Main processing function."""
    if not HAS_DEPS:
        return {"error": "Required Python packages not installed."}

    os.makedirs(output_dir, exist_ok=True)

    try:
        geojson_polygon = json.loads(geojson_polygon_str)
    except json.JSONDecodeError:
        return {"error": "Invalid GeoJSON polygon string."}

    # Sentinel-2 band order: Band 4 = Red (B04), Band 8 = NIR (B08)
    # For L2A products downloaded as separate bands, we assume:
    # before_tif and after_tif each have band layout where band 1=Red, band 2=NIR
    # or the caller passes band 4 as separate files — simplified here for single band TIFs

    try:
        before_red, profile = load_and_clip_band(before_tif, geojson_polygon, band_index=1)
        before_nir, _ = load_and_clip_band(before_tif, geojson_polygon, band_index=2)
        after_red, _ = load_and_clip_band(after_tif, geojson_polygon, band_index=1)
        after_nir, _ = load_and_clip_band(after_tif, geojson_polygon, band_index=2)
    except Exception as e:
        return {"error": f"Failed to read/clip satellite bands: {str(e)}"}

    # Compute NDVI for before and after
    ndvi_before = compute_ndvi(before_nir, before_red)
    ndvi_after = compute_ndvi(after_nir, after_red)

    # Classify damage
    classification = classify_damage(ndvi_before, ndvi_after)

    # Create damage map image
    damage_map_path = os.path.join(output_dir, 'damage_map.png')
    create_damage_map(classification, damage_map_path)

    # Calculate area statistics
    pixel_acres = compute_pixel_area_acres(profile)
    total_pixels = int(np.sum(classification > 0))
    healthy_pixels = int(np.sum(classification == 1))
    moderate_pixels = int(np.sum(classification == 2))
    severe_pixels = int(np.sum(classification == 3))
    damaged_pixels = moderate_pixels + severe_pixels

    total_acres = total_pixels * pixel_acres
    healthy_acres = healthy_pixels * pixel_acres
    moderate_acres = moderate_pixels * pixel_acres
    severe_acres = severe_pixels * pixel_acres
    damaged_acres = damaged_pixels * pixel_acres
    damage_pct = round((damaged_pixels / total_pixels * 100) if total_pixels > 0 else 0, 2)

    # NDVI statistics
    valid_before = ndvi_before[~np.isnan(ndvi_before)]
    valid_after = ndvi_after[~np.isnan(ndvi_after)]
    ndvi_drop = float(np.nanmean(ndvi_before) - np.nanmean(ndvi_after))

    stats = {
        "damageMapPath": damage_map_path,
        "ndviStatistics": {
            "beforeMean": round(float(np.mean(valid_before)), 4) if len(valid_before) > 0 else 0,
            "afterMean": round(float(np.mean(valid_after)), 4) if len(valid_after) > 0 else 0,
            "minNdvi": round(float(np.min(valid_after)), 4) if len(valid_after) > 0 else 0,
            "maxNdvi": round(float(np.max(valid_before)), 4) if len(valid_before) > 0 else 0,
            "ndviDrop": round(ndvi_drop, 4),
        },
        "healthyAreaAcres": round(healthy_acres, 2),
        "moderateDamageAreaAcres": round(moderate_acres, 2),
        "severeDamageAreaAcres": round(severe_acres, 2),
        "damagedAreaAcres": round(damaged_acres, 2),
        "totalAreaAcres": round(total_acres, 2),
        "damagePercentage": damage_pct,
    }

    # Save stats to JSON
    stats_path = os.path.join(output_dir, 'stats.json')
    with open(stats_path, 'w') as f:
        json.dump(stats, f, indent=2)

    return stats


if __name__ == '__main__':
    if len(sys.argv) != 5:
        print("Usage: python process_satellite.py <before_tif> <after_tif> <geojson_polygon_json_string> <output_dir>")
        sys.exit(1)

    before_tif = sys.argv[1]
    after_tif = sys.argv[2]
    geojson_polygon_str = sys.argv[3]
    output_dir = sys.argv[4]

    result = process(before_tif, after_tif, geojson_polygon_str, output_dir)
    print(json.dumps(result))
