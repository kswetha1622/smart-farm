export const mockCrops = [
  {
    id: 'c1',
    nameKey: 'rice',
    rating: 5,
    statusKey: 'best',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
    details: {
      waterReq: 'High',
      duration: '120-150 days',
      seasonKey: 'kharif',
      suitability: '95%',
      tips: 'Ensure proper water level in the initial stages.'
    }
  },
  {
    id: 'c2',
    nameKey: 'maize',
    rating: 4,
    statusKey: 'good',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=400',
    details: {
      waterReq: 'Medium',
      duration: '90-110 days',
      seasonKey: 'kharif',
      suitability: '80%',
      tips: 'Apply nitrogen fertilizer in split doses.'
    }
  },
  {
    id: 'c3',
    nameKey: 'cotton',
    rating: 3,
    statusKey: 'average',
    image: 'https://images.unsplash.com/photo-1627997096645-12cf2c2f6d2b?auto=format&fit=crop&q=80&w=400',
    details: {
      waterReq: 'Low to Medium',
      duration: '150-180 days',
      seasonKey: 'kharif',
      suitability: '65%',
      tips: 'Monitor for bollworm attacks during flowering.'
    }
  }
];
