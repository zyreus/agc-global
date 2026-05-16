-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2026 at 04:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agc_global`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'admin', NULL, '$2y$10$dH5un3E4gRznRIBgsw1gDu5oyru1DVEaorzes10gB6VUqsFj8Z4i.', '2026-04-09 22:28:27', '2026-04-09 22:28:27'),
(2, 'AGCTekadmin', NULL, '$2y$10$IJqqnS/8jPpxjxbqv6C07.ayap7eSY.Z8WRz4PA/Y8kxK3eBCUNvq', '2026-05-15 18:11:14', '2026-05-15 18:12:55');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `is_published`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'AGC Project Consultation Slots Open', 'We are accepting new project consultations for web applications, API integrations, and business systems this month.', 1, '2026-04-09 22:38:03', '2026-04-09 22:38:03', '2026-04-09 22:38:03'),
(2, 'System Maintenance Advisory', 'Scheduled maintenance window every Sunday 1:00 AM to 3:00 AM PHT for infrastructure updates and security checks.', 1, '2026-04-09 22:38:03', '2026-04-09 22:38:03', '2026-04-09 22:38:03'),
(3, 'Digital Transformation Workshops', 'AGC now offers short workshops on process automation, reporting dashboards, and scalable system planning.', 1, '2026-04-09 22:38:03', '2026-04-09 22:38:03', '2026-04-09 22:38:03'),
(4, 'AGC Project Consultation Slots Open', 'We are accepting new project consultations for web applications, API integrations, and business systems this month.', 1, '2026-04-09 22:39:02', '2026-04-09 22:39:02', '2026-04-09 22:39:02'),
(5, 'System Maintenance Advisory', 'Scheduled maintenance window every Sunday 1:00 AM to 3:00 AM PHT for infrastructure updates and security checks.', 1, '2026-04-09 22:39:02', '2026-04-09 22:39:02', '2026-04-09 22:39:02'),
(6, 'Digital Transformation Workshops', 'AGC now offers short workshops on process automation, reporting dashboards, and scalable system planning.', 1, '2026-04-09 22:39:02', '2026-04-09 22:39:02', '2026-04-09 22:39:02'),
(7, 'Agc tek', 'asdfasd', 1, '2026-04-09 23:12:08', '2026-04-09 23:12:08', '2026-04-09 23:12:08');

-- --------------------------------------------------------

--
-- Table structure for table `chat_conversations`
--

CREATE TABLE `chat_conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `status` varchar(24) NOT NULL DEFAULT 'open',
  `archived_at` timestamp NULL DEFAULT NULL,
  `last_message_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_conversations`
--

INSERT INTO `chat_conversations` (`id`, `session_id`, `status`, `archived_at`, `last_message_at`, `created_at`, `updated_at`) VALUES
(1, '7f3485c9-929e-4e68-9779-ce2cb61f4c35', 'open', NULL, '2026-04-09 23:55:31', '2026-04-09 23:54:14', '2026-04-09 23:55:31');

-- --------------------------------------------------------

--
-- Table structure for table `chat_leads`
--

CREATE TABLE `chat_leads` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `concern` text DEFAULT NULL,
  `status` varchar(24) NOT NULL DEFAULT 'open',
  `archived_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `role` varchar(16) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `session_id`, `role`, `message`, `created_at`, `updated_at`) VALUES
(1, '359976fa-b111-4559-8dff-85d6c10d876f', 'user', 'location', '2026-04-09 22:31:38', '2026-04-09 22:31:38'),
(2, '359976fa-b111-4559-8dff-85d6c10d876f', 'assistant', 'Thank you for messaging AGC. We provide end-to-end technology and business solutions. Share what you want to build or improve, and I will guide your next step.', '2026-04-09 22:31:38', '2026-04-09 22:31:38'),
(3, 'd8faeac3-6f74-4a1b-a404-4da00e633a8c', 'user', 'Location', '2026-04-09 23:09:28', '2026-04-09 23:09:28'),
(4, 'd8faeac3-6f74-4a1b-a404-4da00e633a8c', 'assistant', 'Thank you for messaging AGC. We provide end-to-end technology and business solutions. Share what you want to build or improve, and I will guide your next step.', '2026-04-09 23:09:28', '2026-04-09 23:09:28'),
(5, '7f3485c9-929e-4e68-9779-ce2cb61f4c35', 'user', 'Location', '2026-04-09 23:54:14', '2026-04-09 23:54:14'),
(6, '7f3485c9-929e-4e68-9779-ce2cb61f4c35', 'assistant', 'Thank you for messaging AGC. We provide end-to-end technology and business solutions. Share what you want to build or improve, and I will guide your next step.', '2026-04-09 23:54:14', '2026-04-09 23:54:14'),
(7, '7f3485c9-929e-4e68-9779-ce2cb61f4c35', 'assistant', 'Thank you for messaging AGC. We provide end-to-end technology and business solutions. Share what you want to build or improve, and I will guide your next step.', '2026-04-09 23:54:36', '2026-04-09 23:54:36'),
(8, '7f3485c9-929e-4e68-9779-ce2cb61f4c35', 'admin', 'jkgjkhjkghj', '2026-04-09 23:55:31', '2026-04-09 23:55:31');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback_entries`
--

CREATE TABLE `feedback_entries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` varchar(255) NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_04_10_000000_create_chat_messages_table', 2),
(6, '2026_04_10_010000_create_admin_users_table', 2),
(7, '2026_04_10_020000_create_feedback_entries_table', 2),
(8, '2026_04_10_030000_create_announcements_table', 3),
(9, '2026_04_10_030100_create_newsletter_subscribers_table', 3),
(10, '2026_04_10_040000_create_chat_conversations_table', 4),
(11, '2026_04_10_040100_create_chat_leads_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `subscribed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `newsletter_subscribers`
--

INSERT INTO `newsletter_subscribers` (`id`, `name`, `email`, `subscribed_at`, `created_at`, `updated_at`) VALUES
(1, 'Zyrah Faith', 'zyrahfaithcubagascon@gmail.com', '2026-04-09 22:43:48', '2026-04-09 22:43:48', '2026-04-09 22:43:48');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\AdminUser', 1, 'admin-portal', '313ced71870bab0ee435ac54fc519a18d7e55c7460943c7affb9be76cff027c2', '[\"*\"]', '2026-04-09 23:49:19', '2026-04-09 22:40:59', '2026-04-09 23:49:19'),
(2, 'App\\Models\\AdminUser', 1, 'admin-portal', '766535c9274db0c7226d75c838e326907b888aee2381b4b90f97a6092f2344af', '[\"*\"]', '2026-04-10 00:10:03', '2026-04-09 23:49:24', '2026-04-10 00:10:03'),
(3, 'App\\Models\\AdminUser', 2, 'admin-portal', '107e64966d024128172a2000bd84f43e0be5050d8f0c899495ad70eef1a36b63', '[\"*\"]', NULL, '2026-05-15 18:31:21', '2026-05-15 18:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'AGC Admin', 'admin@agc.test', NULL, '$2y$10$xCbjg3nYZmMwX9.1l1Cqy.yVndKiQZ0yBx.iYtmuMNIWLSvE6yKxW', NULL, '2026-04-07 22:04:15', '2026-04-07 22:04:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_users_username_unique` (`username`),
  ADD UNIQUE KEY `admin_users_email_unique` (`email`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcements_is_published_index` (`is_published`),
  ADD KEY `announcements_published_at_index` (`published_at`);

--
-- Indexes for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chat_conversations_session_id_unique` (`session_id`),
  ADD KEY `chat_conversations_status_index` (`status`),
  ADD KEY `chat_conversations_archived_at_index` (`archived_at`),
  ADD KEY `chat_conversations_last_message_at_index` (`last_message_at`);

--
-- Indexes for table `chat_leads`
--
ALTER TABLE `chat_leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_leads_session_id_index` (`session_id`),
  ADD KEY `chat_leads_status_index` (`status`),
  ADD KEY `chat_leads_archived_at_index` (`archived_at`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_session_id_index` (`session_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `feedback_entries`
--
ALTER TABLE `feedback_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feedback_entries_conversation_id_index` (`conversation_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `newsletter_subscribers_email_unique` (`email`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chat_leads`
--
ALTER TABLE `chat_leads`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback_entries`
--
ALTER TABLE `feedback_entries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
