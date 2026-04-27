-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('superadmin', 'manager', 'kasir', 'gudang', 'owner') NOT NULL DEFAULT 'kasir',
    `phone` VARCHAR(20) NULL,
    `status` ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(20) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `emoji` VARCHAR(10) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 0,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `bulkSack` INTEGER NOT NULL DEFAULT 0,
    `bulkKg` INTEGER NOT NULL DEFAULT 0,
    `minStock` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNo` VARCHAR(20) NOT NULL,
    `customer` VARCHAR(100) NOT NULL,
    `type` ENUM('Tunai', 'Online', 'Staf Offline') NOT NULL,
    `method` ENUM('Tunai', 'Transfer', 'QRIS', 'Debit', 'Kredit', 'COD') NOT NULL,
    `subtotal` INTEGER NOT NULL DEFAULT 0,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `tax` INTEGER NOT NULL DEFAULT 0,
    `shipping` INTEGER NOT NULL DEFAULT 0,
    `total` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('paid', 'pending', 'process', 'cancel') NOT NULL DEFAULT 'pending',
    `phone` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `note` TEXT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cashierId` INTEGER NULL,

    UNIQUE INDEX `orders_orderNo_key`(`orderNo`),
    INDEX `orders_status_idx`(`status`),
    INDEX `orders_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `qty` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `subtotal` INTEGER NOT NULL,

    INDEX `order_items_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_movements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `type` ENUM('masuk', 'keluar', 'konversi', 'opname') NOT NULL,
    `qtyBefore` INTEGER NOT NULL,
    `qtyChange` INTEGER NOT NULL,
    `qtyAfter` INTEGER NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `note` TEXT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,

    INDEX `stock_movements_productId_idx`(`productId`),
    INDEX `stock_movements_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_cashierId_fkey` FOREIGN KEY (`cashierId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
