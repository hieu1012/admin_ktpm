export const ORDERS = [
    // Thêm vào cuối mảng ORDERS trong file orders.ts
    {
        id: "DH1006",
        customerId: 105,
        customerName: "Hoàng Minh Tuấn",
        phone: "0986321456",
        totalPrice: 42750000,
        status: "completed",
        createdAt: "2025-05-18T09:23:45",
        items: [
            { name: "Laptop Dell XPS 13", quantity: 1, price: 38000000 },
            { name: "Chuột Logitech MX Master 3", quantity: 1, price: 2500000 },
            { name: "Bàn di chuột Razer", quantity: 1, price: 750000 },
            { name: "Túi đựng laptop", quantity: 1, price: 1500000 }
        ]
    },
    {
        id: "DH1007",
        customerId: 106,
        customerName: "Nguyễn Thị Mai",
        phone: "0912567890",
        totalPrice: 27490000,
        status: "shipped",
        createdAt: "2025-05-16T14:37:12",
        items: [
            { name: "iPad Air 5", quantity: 1, price: 16990000 },
            { name: "Apple Pencil 2", quantity: 1, price: 3500000 },
            { name: "Bao da iPad Magic Keyboard", quantity: 1, price: 7000000 }
        ]
    },
    {
        id: "DH1008",
        customerId: 107,
        customerName: "Trần Đức Anh",
        phone: "0978123456",
        totalPrice: 63780000,
        status: "pending",
        createdAt: "2025-05-19T07:15:30",
        items: [
            { name: "MacBook Pro 14 M3", quantity: 1, price: 52000000 },
            { name: "Apple Care+", quantity: 1, price: 5500000 },
            { name: "Adapter USB-C Hub", quantity: 1, price: 1280000 },
            { name: "Túi chống sốc", quantity: 1, price: 850000 },
            { name: "Bộ vệ sinh laptop", quantity: 1, price: 150000 },
            { name: "Dây sạc USB-C", quantity: 2, price: 2000000 }
        ]
    },
    {
        id: "DH1009",
        customerId: 108,
        customerName: "Lê Thị Hương",
        phone: "0934567123",
        totalPrice: 23990000,
        status: "cancelled",
        createdAt: "2025-05-12T18:45:22",
        items: [
            { name: "Samsung Galaxy Tab S9", quantity: 1, price: 19990000 },
            { name: "Bao da Samsung", quantity: 1, price: 1500000 },
            { name: "Bút S Pen", quantity: 1, price: 2500000 }
        ]
    },
    {
        id: "DH1010",
        customerId: 109,
        customerName: "Phạm Văn Hiếu",
        phone: "0965432178",
        totalPrice: 85250000,
        status: "shipped",
        createdAt: "2025-05-15T11:32:40",
        items: [
            { name: "iPhone 15 Pro Max", quantity: 2, price: 56000000 },
            { name: "Apple Watch Series 9", quantity: 1, price: 12000000 },
            { name: "AirPods Pro 2", quantity: 1, price: 5500000 },
            { name: "MagSafe Charger", quantity: 2, price: 3000000 },
            { name: "Ốp lưng iPhone", quantity: 2, price: 1500000 },
            { name: "Cường lực iPhone", quantity: 2, price: 500000 },
            { name: "Dây đeo Apple Watch", quantity: 1, price: 1750000 }
        ]
    },
    {
        id: "DH1011",
        customerId: 110,
        customerName: "Nguyễn Thanh Tùng",
        phone: "0908765432",
        totalPrice: 7580000,
        status: "pending",
        createdAt: "2025-05-19T10:05:18",
        items: [
            { name: "Tai nghe Sony WH-1000XM5", quantity: 1, price: 6500000 },
            { name: "Adapter Bluetooth", quantity: 1, price: 350000 },
            { name: "Túi đựng tai nghe", quantity: 1, price: 230000 },
            { name: "Dây cáp audio", quantity: 1, price: 500000 }
        ]
    },
    {
        id: "DH1012",
        customerId: 111,
        customerName: "Trần Minh Quân",
        phone: "0976123987",
        totalPrice: 45770000,
        status: "completed",
        createdAt: "2025-05-06T09:15:37",
        items: [
            { name: "Máy ảnh Sony A7 IV", quantity: 1, price: 38000000 },
            { name: "Thẻ nhớ SanDisk 256GB", quantity: 2, price: 2400000 },
            { name: "Pin Sony", quantity: 1, price: 1800000 },
            { name: "Túi đựng máy ảnh", quantity: 1, price: 1200000 },
            { name: "Dây đeo máy ảnh", quantity: 1, price: 950000 },
            { name: "Bộ vệ sinh ống kính", quantity: 1, price: 420000 }
        ]
    },
    {
        id: "DH1013",
        customerId: 112,
        customerName: "Lê Văn Đức",
        phone: "0943678215",
        totalPrice: 54980000,
        status: "shipped",
        createdAt: "2025-05-14T16:28:53",
        items: [
            { name: "PC Gaming cao cấp", quantity: 1, price: 42000000 },
            { name: "Màn hình MSI 27\" 240Hz", quantity: 1, price: 8500000 },
            { name: "Bàn phím cơ Corsair", quantity: 1, price: 2200000 },
            { name: "Chuột Logitech G Pro", quantity: 1, price: 1800000 },
            { name: "Tai nghe Gaming Steelseries", quantity: 1, price: 480000 }
        ]
    },
    {
        id: "DH1014",
        customerId: 113,
        customerName: "Vũ Thị Hà",
        phone: "0912345987",
        totalPrice: 2730000,
        status: "pending",
        createdAt: "2025-05-19T15:42:09",
        items: [
            { name: "Loa Bluetooth JBL Flip 6", quantity: 1, price: 2500000 },
            { name: "Dây cáp sạc", quantity: 1, price: 230000 }
        ]
    },
    {
        id: "DH1015",
        customerId: 114,
        customerName: "Đỗ Thành Nam",
        phone: "0932654789",
        totalPrice: 26950000,
        status: "completed",
        createdAt: "2025-05-11T13:19:27",
        items: [
            { name: "Xiaomi 14T Pro", quantity: 1, price: 16500000 },
            { name: "Redmi Watch 3", quantity: 1, price: 2200000 },
            { name: "Tai nghe Redmi Buds 4", quantity: 1, price: 1500000 },
            { name: "Sạc không dây Xiaomi", quantity: 1, price: 750000 },
            { name: "Pin dự phòng Xiaomi 20000mAh", quantity: 2, price: 2800000 },
            { name: "Ốp lưng", quantity: 1, price: 350000 },
            { name: "Cường lực", quantity: 2, price: 350000 },
            { name: "Dây sạc USB-C", quantity: 1, price: 500000 }
        ]
    }
];
