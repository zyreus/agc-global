-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2026 at 05:38 AM
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
  `role` varchar(48) NOT NULL DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@agc.local', '$2y$10$A7fUMIEmLWt9fXQlh.JSpuOvWOSsGzZVrGQmsSWch4DhMmHD0rWfm', 'admin', '2026-04-09 22:28:27', '2026-05-17 19:21:30'),
(2, 'AGCTekadmin', NULL, '$2y$10$8nZj4q.Ci7uksP1gvvjcJeWH359mGbHIOppKRVdejx8Pl6hthr7Bi', 'admin', '2026-05-15 18:11:14', '2026-05-17 19:21:30');

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
-- Table structure for table `campaign_automations`
--

CREATE TABLE `campaign_automations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `brevo_template_id` bigint(20) UNSIGNED DEFAULT NULL,
  `brevo_list_id` bigint(20) UNSIGNED DEFAULT NULL,
  `trigger` varchar(64) NOT NULL,
  `segment_filter` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`segment_filter`)),
  `schedule_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`schedule_config`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign_automations`
--

INSERT INTO `campaign_automations` (`id`, `name`, `brevo_template_id`, `brevo_list_id`, `trigger`, `segment_filter`, `schedule_config`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Lead nurture (configure Brevo template)', NULL, NULL, 'lead_submitted', '{\"segment\":\"lead\"}', '{\"note\":\"Wire to Brevo automation after template ID is set\"}', 0, '2026-05-15 18:44:45', '2026-05-15 18:44:45');

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_conversations`
--

CREATE TABLE `chatbot_conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(120) NOT NULL,
  `channel` varchar(32) NOT NULL DEFAULT 'website',
  `customer_profile_id` bigint(20) UNSIGNED DEFAULT NULL,
  `segment` varchar(64) NOT NULL DEFAULT 'default',
  `last_detected_intent` varchar(64) DEFAULT NULL,
  `escalation_requested_at` timestamp NULL DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_messages`
--

CREATE TABLE `chatbot_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(120) NOT NULL,
  `chat_message_id` bigint(20) UNSIGNED NOT NULL,
  `detected_intent` varchar(64) DEFAULT NULL,
  `intent_confidence` decimal(6,4) DEFAULT NULL,
  `uncertain` tinyint(1) NOT NULL DEFAULT 0,
  `escalate_triggered` tinyint(1) NOT NULL DEFAULT 0,
  `model_used` varchar(64) DEFAULT NULL,
  `response_tokens` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, '7f3485c9-929e-4e68-9779-ce2cb61f4c35', 'closed', NULL, '2026-04-09 23:55:31', '2026-04-09 23:54:14', '2026-05-17 19:24:45');

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
-- Table structure for table `customer_intents`
--

CREATE TABLE `customer_intents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(120) NOT NULL,
  `chat_message_id` bigint(20) UNSIGNED DEFAULT NULL,
  `intent_label` varchar(64) NOT NULL,
  `confidence` decimal(6,4) NOT NULL DEFAULT 0.0000,
  `source` varchar(24) NOT NULL DEFAULT 'openai',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_profiles`
--

CREATE TABLE `customer_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(120) DEFAULT NULL,
  `email_hash` varchar(64) DEFAULT NULL,
  `email_encrypted` text DEFAULT NULL,
  `phone_encrypted` text DEFAULT NULL,
  `name_encrypted` text DEFAULT NULL,
  `segment` varchar(64) NOT NULL DEFAULT 'default',
  `gdpr_consent_at` timestamp NULL DEFAULT NULL,
  `marketing_opt_in` tinyint(1) NOT NULL DEFAULT 0,
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `escalation_logs`
--

CREATE TABLE `escalation_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(120) NOT NULL,
  `reason` text NOT NULL,
  `triggered_by` varchar(24) NOT NULL DEFAULT 'ai',
  `context` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`context`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Table structure for table `faq_training_data`
--

CREATE TABLE `faq_training_data` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(64) NOT NULL DEFAULT 'general',
  `title` varchar(255) DEFAULT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `keywords` text DEFAULT NULL,
  `priority` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faq_training_data`
--

INSERT INTO `faq_training_data` (`id`, `category`, `title`, `question`, `answer`, `keywords`, `priority`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'policy', 'Payments', 'How do I make a payment for AGC services?', 'Project billing is agreed in your statement of work or contract. For payment methods, currency, and schedules, a billing specialist will confirm details with you during onboarding. I can connect you with our team if you share your project reference.', 'payment,invoice,billing,pay', 20, 1, '2026-05-15 18:44:45', '2026-05-15 18:44:45'),
(2, 'policy', 'Loans & financing', 'Do you offer loans or consumer financing?', 'AGC provides technology and business solutions; we do not originate loans or provide regulated financial advice. For financing questions related to a vendor arrangement, a specialist can review your situation and suggest appropriate next steps.', 'loan,financing,mortgage,credit', 30, 1, '2026-05-15 18:44:45', '2026-05-15 18:44:45'),
(3, 'support', 'Human support', 'Can I speak to a person?', 'Yes. Use the “Talk to Representative” option in the chat widget, or email agc.billing2026@gmail.com or call +63 9190675099 with your request.', 'human,agent,person,live', 25, 1, '2026-05-15 18:44:45', '2026-05-15 18:44:45'),
(4, 'services', 'Services overview', 'What does AGC build?', 'AGC delivers IT solutions & system development, software development (including Laravel/PHP and UI/UX), business solutions (automation, data, analytics), and security & maintenance.', 'services,build,development', 10, 1, '2026-05-15 18:44:45', '2026-05-15 18:44:45');

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
(11, '2026_04_10_040100_create_chat_leads_table', 4),
(12, '2026_05_16_100000_enterprise_chatbot_schema', 5),
(13, '2026_05_16_100100_add_role_to_admin_users', 5);

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
(3, 'App\\Models\\AdminUser', 2, 'admin-portal', '107e64966d024128172a2000bd84f43e0be5050d8f0c899495ad70eef1a36b63', '[\"*\"]', NULL, '2026-05-15 18:31:21', '2026-05-15 18:31:21'),
(4, 'App\\Models\\AdminUser', 2, 'admin-portal', 'c6d605db8adfab59b1261c0e113a9c4d50e91c19656b7f57b0ac853cd1389d8c', '[\"*\"]', NULL, '2026-05-17 19:21:11', '2026-05-17 19:21:11'),
(5, 'App\\Models\\AdminUser', 1, 'admin-portal', '27d37f9fc60609c74988943af68207b2d145aadf2434281e39313116ad85e641', '[\"*\"]', NULL, '2026-05-17 19:21:37', '2026-05-17 19:21:37'),
(6, 'App\\Models\\AdminUser', 1, 'admin-portal', '77e46033016725b7d32d7a8a34980789fceecf653c53135a5069ad800dacd0ab', '[\"*\"]', '2026-05-17 19:24:57', '2026-05-17 19:22:39', '2026-05-17 19:24:57'),
(7, 'App\\Models\\AdminUser', 1, 'admin-portal', 'dc879c76dace1c69ddedd5905d772ca13af8614912e73d70457d545cb91c0c8e', '[\"*\"]', '2026-05-17 19:29:22', '2026-05-17 19:29:13', '2026-05-17 19:29:22');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(120) DEFAULT NULL,
  `customer_profile_id` bigint(20) UNSIGNED DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `priority` varchar(16) NOT NULL DEFAULT 'normal',
  `status` varchar(24) NOT NULL DEFAULT 'open',
  `channel` varchar(32) NOT NULL DEFAULT 'website',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Indexes for table `campaign_automations`
--
ALTER TABLE `campaign_automations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campaign_automations_trigger_index` (`trigger`),
  ADD KEY `campaign_automations_is_active_index` (`is_active`);

--
-- Indexes for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chatbot_conversations_session_id_unique` (`session_id`),
  ADD KEY `chatbot_conversations_customer_profile_id_foreign` (`customer_profile_id`),
  ADD KEY `chatbot_conversations_channel_index` (`channel`),
  ADD KEY `chatbot_conversations_segment_index` (`segment`),
  ADD KEY `chatbot_conversations_last_detected_intent_index` (`last_detected_intent`),
  ADD KEY `chatbot_conversations_escalation_requested_at_index` (`escalation_requested_at`);

--
-- Indexes for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chatbot_messages_chat_message_id_unique` (`chat_message_id`),
  ADD KEY `chatbot_messages_session_id_index` (`session_id`),
  ADD KEY `chatbot_messages_detected_intent_index` (`detected_intent`);

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
-- Indexes for table `customer_intents`
--
ALTER TABLE `customer_intents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_intents_chat_message_id_foreign` (`chat_message_id`),
  ADD KEY `customer_intents_session_id_index` (`session_id`),
  ADD KEY `customer_intents_intent_label_index` (`intent_label`);

--
-- Indexes for table `customer_profiles`
--
ALTER TABLE `customer_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_profiles_email_hash_unique` (`email_hash`),
  ADD KEY `customer_profiles_session_id_index` (`session_id`),
  ADD KEY `customer_profiles_segment_index` (`segment`);

--
-- Indexes for table `escalation_logs`
--
ALTER TABLE `escalation_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `escalation_logs_session_id_index` (`session_id`),
  ADD KEY `escalation_logs_triggered_by_index` (`triggered_by`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `faq_training_data`
--
ALTER TABLE `faq_training_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `faq_training_data_category_index` (`category`),
  ADD KEY `faq_training_data_priority_index` (`priority`),
  ADD KEY `faq_training_data_is_active_index` (`is_active`);

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
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `support_tickets_customer_profile_id_foreign` (`customer_profile_id`),
  ADD KEY `support_tickets_session_id_index` (`session_id`),
  ADD KEY `support_tickets_priority_index` (`priority`),
  ADD KEY `support_tickets_status_index` (`status`);

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
-- AUTO_INCREMENT for table `campaign_automations`
--
ALTER TABLE `campaign_automations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `customer_intents`
--
ALTER TABLE `customer_intents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_profiles`
--
ALTER TABLE `customer_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `escalation_logs`
--
ALTER TABLE `escalation_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faq_training_data`
--
ALTER TABLE `faq_training_data`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feedback_entries`
--
ALTER TABLE `feedback_entries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  ADD CONSTRAINT `chatbot_conversations_customer_profile_id_foreign` FOREIGN KEY (`customer_profile_id`) REFERENCES `customer_profiles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD CONSTRAINT `chatbot_messages_chat_message_id_foreign` FOREIGN KEY (`chat_message_id`) REFERENCES `chat_messages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_intents`
--
ALTER TABLE `customer_intents`
  ADD CONSTRAINT `customer_intents_chat_message_id_foreign` FOREIGN KEY (`chat_message_id`) REFERENCES `chat_messages` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_customer_profile_id_foreign` FOREIGN KEY (`customer_profile_id`) REFERENCES `customer_profiles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
