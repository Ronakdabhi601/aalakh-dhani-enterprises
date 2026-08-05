CREATE TABLE `savings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`monthlyDeposit` int NOT NULL DEFAULT 1000,
	`totalSavings` int NOT NULL DEFAULT 0,
	`profitEarned` int NOT NULL DEFAULT 0,
	`lastDepositDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `savings_id` PRIMARY KEY(`id`)
);
