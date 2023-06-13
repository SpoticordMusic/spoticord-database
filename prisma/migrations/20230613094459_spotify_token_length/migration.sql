/*
  Warnings:

  - You are about to alter the column `device_name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(16)`.

*/
-- AlterTable
ALTER TABLE `Account` MODIFY `access_token` VARCHAR(1024) NOT NULL,
    MODIFY `refresh_token` VARCHAR(1024) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `device_name` VARCHAR(16) NOT NULL DEFAULT 'Spoticord';
