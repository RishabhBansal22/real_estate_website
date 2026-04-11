import json
from pathlib import Path
path = Path('mock_properties.json')
data = json.loads(path.read_text())
updates = {
    '1': {
        'imageUrl': 'https://images.unsplash.com/photo-1596893268413-db5b44aa6b75?auto=format&fit=crop&q=80&w=800',
        'reraNumber': 'RERA/UP/2026/12345',
        'highlights': ['Hot Deal', 'Prime Location']
    },
    '2': {
        'imageUrl': 'https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&q=80&w=800',
        'reraNumber': 'RERA/UP/2026/56789',
        'highlights': ['New', 'Eco Smart']
    },
    '3': {
        'imageUrl': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
        'reraNumber': 'RERA/UK/2026/90123',
        'highlights': ['Hot Deal', 'Green Belt']
    },
    '4': {
        'imageUrl': 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800',
        'reraNumber': 'RERA/UP/2026/11223',
        'highlights': ['New', 'River View']
    },
    '5': {
        'imageUrl': 'https://images.unsplash.com/photo-1560448074-8f19ac5ea7ab?auto=format&fit=crop&q=80&w=800',
        'reraNumber': 'RERA/UP/2026/44556',
        'highlights': ['New', 'Smart Home']
    },
    '6': {
        'imageUrl': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
        'reraNumber': 'RERA/UK/2026/22334',
        'highlights': ['Hot Deal', 'High ROI']
    },
    '7': {
        'imageUrl': 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=800',
        'reraNumber': 'RERA/HR/2026/55667',
        'highlights': ['New', 'Luxury Finish']
    },
    '8': {
        'imageUrl': 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=800',
        'reraNumber': 'RERA/UP/2026/77889',
        'highlights': ['Hot Deal', 'Family Living']
    }
}
for item in data:
    if item['id'] in updates:
        item.update(updates[item['id']])
path.write_text(json.dumps(data, indent=2))
print('mock properties updated')
