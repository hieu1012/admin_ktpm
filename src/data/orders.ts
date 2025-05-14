export const ORDERS = [
    {
        id: "DH001",
        customerId: 1,
        customerName: "Nguyễn Văn A",
        phone: "0912345678",
        totalPrice: 2000000,
        status: "pending",
        createdAt: "2025-05-12",
        items: [
            { name: "iPhone 14", quantity: 1, price: 1800000 },
            { name: "Ốp lưng", quantity: 1, price: 200000 }
        ]
    },
    {
        id: "DH002",
        customerId: 2,
        customerName: "Trần Thị B",
        phone: "0987654321",
        totalPrice: 1000000,
        status: "shipped",
        createdAt: "2025-05-10",
        items: [
            { name: "Samsung A54", quantity: 1, price: 1000000 }
        ]
    },
    {
        id: "DH003",
        customerId: 3,
        customerName: "Lê Văn C",
        phone: "0933445566",
        totalPrice: 2500000,
        status: "completed",
        createdAt: "2025-05-09",
        items: [
            { name: "Laptop Dell", quantity: 1, price: 2500000 }
        ]
    },
    {
        id: "DH004",
        customerId: 4,
        customerName: "Phạm Thị D",
        phone: "0909988776",
        totalPrice: 500000,
        status: "cancelled",
        createdAt: "2025-05-08",
        items: [
            { name: "Tai nghe bluetooth", quantity: 1, price: 500000 }
        ]
    }
];
