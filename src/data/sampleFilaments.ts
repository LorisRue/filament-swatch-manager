import { filament } from "@/types/filament";

export const sampleFilaments: filament[] = [
    {
        identifier: 'PL825',
        material: 'PLA',
        type: 'Matte PLA',
        brand: 'Hatchbox',
        color: 'White',
        colorHex: '#FFFFFF',
        diameter: 1.75,
        cost: 25,
        weight: 1000,
        weightLeft: 800,
        inStock: true,
        printSettings: {
            nozzleTemp: 200,
            bedTemp: 60,
            flowRatio: 1.0,
            pressureAdvance: 0.05,
            retractionDistance: 1.0,
            maxVolumetricSpeed: 12
        },
        dateAdded: "2024-06-01T10:00:00Z"
    },
    {
        identifier: 'PL826',
        material: 'PLA',
        type: 'Silk PLA',
        brand: 'eSun',
        color: 'Gold',
        colorHex: '#FFD700',
        diameter: 1.75,
        weight: 1000,
        inStock: true,
        printSettings: {
            nozzleTemp: 210,
            bedTemp: 60
        },
        dateAdded: "2024-06-02T10:00:00Z"
    },
    {
        identifier: 'PL827',
        material: 'PLA',
        type: 'Standard PLA',
        brand: 'Prusament',
        color: 'Orange',
        colorHex: '#FFA500',
        diameter: 1.75,
        cost: 32,
        weight: 850,
        inStock: false,
        printSettings: {},
        dateAdded: "2024-06-03T10:00:00Z"
    },
    {
        identifier: 'PL828',
        material: 'PLA',
        type: 'Matte PLA',
        brand: 'Overture',
        color: 'Black',
        colorHex: '#000000',
        diameter: 1.75,
        weight: 1000,
        weightLeft: 400,
        inStock: true,
        printSettings: {
            nozzleTemp: 205
        },
        dateAdded: "2024-06-04T10:00:00Z"
    },
    {
        identifier: 'PL829',
        material: 'PLA',
        type: 'Silk PLA',
        brand: 'Sunlu',
        color: 'Silver',
        colorHex: '#C0C0C0',
        diameter: 1.75,
        cost: 27,
        weight: 1000,
        inStock: true,
        printSettings: {
            nozzleTemp: 215,
            bedTemp: 55,
            flowRatio: 1.05
        },
        dateAdded: "2024-06-05T10:00:00Z"
    },
    {
        identifier: 'PL830',
        material: 'PLA',
        type: 'Standard PLA',
        brand: 'Amazon Basics',
        color: 'Blue',
        colorHex: '#0000FF',
        diameter: 1.75,
        weight: 1000,
        inStock: false,
        printSettings: {},
        dateAdded: "2024-06-06T10:00:00Z"
    },
    {
        identifier: 'AB101',
        material: 'ABS',
        type: 'Standard ABS',
        brand: 'Hatchbox',
        color: 'Red',
        colorHex: '#FF0000',
        diameter: 1.75,
        cost: 30,
        weight: 1000,
        weightLeft: 700,
        inStock: true,
        printSettings: {
            nozzleTemp: 240,
            bedTemp: 100,
            retractionDistance: 2.0
        },
        dateAdded: "2024-06-07T10:00:00Z"
    },
    {
        identifier: 'AB102',
        material: 'ABS',
        type: 'Premium ABS',
        brand: 'eSun',
        color: 'Green',
        colorHex: '#00FF00',
        diameter: 1.75,
        weight: 750,
        inStock: true,
        printSettings: {},
        dateAdded: "2024-06-08T10:00:00Z"
    },
    {
        identifier: 'AB103',
        material: 'ABS',
        type: 'Standard ABS',
        brand: 'Overture',
        color: 'Yellow',
        colorHex: '#FFFF00',
        diameter: 1.75,
        cost: 29,
        weight: 1000,
        inStock: false,
        printSettings: {
            nozzleTemp: 235,
            bedTemp: 95
        },
        dateAdded: "2024-06-09T10:00:00Z"
    },
    {
        identifier: 'PE201',
        material: 'PETG',
        type: 'Standard PETG',
        brand: 'Prusament',
        color: 'Clear',
        colorHex: '#F8F8FF',
        diameter: 1.75,
        cost: 33,
        weight: 1000,
        weightLeft: 1000,
        inStock: true,
        printSettings: {
            nozzleTemp: 240,
            bedTemp: 80,
            flowRatio: 1.1
        },
        dateAdded: "2024-06-10T10:00:00Z"
    },
    {
        identifier: 'PE202',
        material: 'PETG',
        type: 'Premium PETG',
        brand: 'Sunlu',
        color: 'Blue',
        colorHex: '#1E90FF',
        diameter: 1.75,
        weight: 1000,
        inStock: false,
        printSettings: {},
        dateAdded: "2024-06-11T10:00:00Z"
    },
    {
        identifier: 'PE203',
        material: 'PETG',
        type: 'Standard PETG',
        brand: 'eSun',
        color: 'Green',
        colorHex: '#32CD32',
        diameter: 1.75,
        cost: 29,
        weight: 1000,
        weightLeft: 900,
        inStock: true,
        printSettings: {
            nozzleTemp: 245,
            bedTemp: 85,
            pressureAdvance: 0.08
        },
        dateAdded: "2024-06-12T10:00:00Z"
    },
    {
        identifier: 'NY301',
        material: 'NYLON',
        type: 'Nylon',
        brand: 'Taulman',
        color: 'Natural',
        colorHex: '#F5F5DC',
        diameter: 1.75,
        cost: 45,
        weight: 500,
        inStock: true,
        printSettings: {
            nozzleTemp: 255,
            bedTemp: 70
        },
        dateAdded: "2024-06-13T10:00:00Z"
    },
    {
        identifier: 'NY302',
        material: 'NYLON',
        type: 'Nylon',
        brand: 'MatterHackers',
        color: 'Black',
        colorHex: '#222222',
        diameter: 1.75,
        weight: 500,
        weightLeft: 500,
        inStock: false,
        printSettings: {},
        dateAdded: "2024-06-14T10:00:00Z"
    },
    {
        identifier: 'TPU401',
        material: 'TPU',
        type: 'Flexible',
        brand: 'Sainsmart',
        color: 'Red',
        colorHex: '#B22222',
        diameter: 1.75,
        cost: 38,
        weight: 500,
        weightLeft: 300,
        inStock: true,
        printSettings: {
            nozzleTemp: 225,
            bedTemp: 50,
            flowRatio: 1.2,
            retractionDistance: 0.5
        },
        dateAdded: "2024-06-15T10:00:00Z"
    },
    {
        identifier: 'TPU402',
        material: 'TPU',
        type: 'Flexible',
        brand: 'Overture',
        color: 'Yellow',
        colorHex: '#FFD700',
        diameter: 1.75,
        weight: 500,
        inStock: false,
        printSettings: {},
        dateAdded: "2024-06-16T10:00:00Z"
    },
    {
        identifier: 'TPU403',
        material: 'TPU',
        type: 'Flexible',
        brand: 'Prusament',
        color: 'Blue',
        colorHex: '#4682B4',
        diameter: 1.75,
        cost: 40,
        weight: 500,
        inStock: true,
        printSettings: {
            nozzleTemp: 230
        },
        dateAdded: "2024-06-17T10:00:00Z"
    },
    {
        identifier: 'PC501',
        material: 'ASA',
        type: 'PC',
        brand: 'Polymaker',
        color: 'White',
        colorHex: '#F8F8FF',
        diameter: 1.75,
        cost: 60,
        weight: 750,
        weightLeft: 750,
        inStock: true,
        printSettings: {
            nozzleTemp: 260,
            bedTemp: 110
        },
        dateAdded: "2024-06-18T10:00:00Z"
    },
    {
        identifier: 'PC502',
        material: 'ASA',
        type: 'PC',
        brand: 'eSun',
        color: 'Black',
        colorHex: '#111111',
        diameter: 1.75,
        weight: 750,
        weightLeft: 100,
        inStock: false,
        printSettings: {},
        dateAdded: "2024-06-19T10:00:00Z"
    },
    {
        identifier: 'PC503',
        material: 'ASA',
        type: 'PC',
        brand: 'Prusament',
        color: 'Clear',
        colorHex: '#E5E4E2',
        diameter: 1.75,
        cost: 62,
        weight: 750,
        inStock: true,
        printSettings: {
            nozzleTemp: 265,
            bedTemp: 115,
            flowRatio: 1.15
        },
        dateAdded: "2024-06-20T10:00:00Z"
    }
];