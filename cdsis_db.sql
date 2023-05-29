-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2023 at 05:18 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cdsis_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblbranches`
--

CREATE TABLE `tblbranches` (
  `id` int(11) NOT NULL,
  `branchName` varchar(255) NOT NULL,
  `branchLocation` varchar(255) NOT NULL,
  `branchRegion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblbranches`
--

INSERT INTO `tblbranches` (`id`, `branchName`, `branchLocation`, `branchRegion`) VALUES
(1, 'DVS Pet Supplies Trading', 'Talavera', 'III');

-- --------------------------------------------------------

--
-- Table structure for table `tblcheckups`
--

CREATE TABLE `tblcheckups` (
  `id` int(11) NOT NULL,
  `patientId` int(11) NOT NULL,
  `weight` double NOT NULL,
  `temperature` double NOT NULL,
  `complain` text NOT NULL,
  `history` text NOT NULL,
  `laboratories` text NOT NULL,
  `treatment` text NOT NULL,
  `diagnosis` text NOT NULL,
  `remarks` text NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdBy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblcheckups`
--

INSERT INTO `tblcheckups` (`id`, `patientId`, `weight`, `temperature`, `complain`, `history`, `laboratories`, `treatment`, `diagnosis`, `remarks`, `createdDate`, `createdBy`) VALUES
(1, 3, 4, 37, '6IN1 + 3RD DEWORM APPETITE (+) * NO V/D', 'no history', 'xray', 'PROXANTEL + C6', 'lack of vitamins', 'dasdasdasdasdasdasdas', '2023-05-29 15:10:07', 4);

-- --------------------------------------------------------

--
-- Table structure for table `tbldistribution`
--

CREATE TABLE `tbldistribution` (
  `id` int(11) NOT NULL,
  `agentId` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `checkIn` timestamp NULL DEFAULT NULL,
  `checkOut` timestamp NULL DEFAULT NULL,
  `remarks` text NOT NULL,
  `status` varchar(255) NOT NULL,
  `orderStatus` text NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tblpatient_info`
--

CREATE TABLE `tblpatient_info` (
  `id` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `petName` varchar(255) NOT NULL,
  `birthDate` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `breed` varchar(255) NOT NULL,
  `species` text NOT NULL,
  `remarks` longtext NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdBy` int(11) NOT NULL,
  `isDeceased` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblpatient_info`
--

INSERT INTO `tblpatient_info` (`id`, `clientId`, `petName`, `birthDate`, `age`, `sex`, `breed`, `species`, `remarks`, `createdDate`, `createdBy`, `isDeceased`) VALUES
(2, 5, 'Snowy', '2023-01-24', 4, 'Female', 'Askal', 'Askal', 'Need bakuna', '2023-05-25 17:20:46', 4, 0),
(3, 6, 'ROCKET', '2023-02-24', 0, 'MALE', 'CHOW-CHOW', 'CANINE', '', '2023-05-26 16:26:43', 4, 0),
(4, 7, 'NHALA', '2023-03-28', 0, 'FEMALE', 'SHIH - TZU', 'CANINE', '', '2023-05-26 16:30:14', 4, 0),
(5, 8, 'GUCCI', '2019-07-01', 0, 'FEMALE', 'SHIH - TZU', 'CANINE', '', '2023-05-26 16:32:59', 4, 0),
(6, 9, 'COOPER', '2022-11-26', 0, 'MALE', 'SHIH - TZU', 'CANINE', '', '2023-05-26 16:35:28', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblprocessflow`
--

CREATE TABLE `tblprocessflow` (
  `id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `processedBy` varchar(255) NOT NULL,
  `step` int(11) NOT NULL,
  `nextStep` text NOT NULL,
  `currentStatus` text NOT NULL,
  `description` text NOT NULL,
  `listAction` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblprocessflow`
--

INSERT INTO `tblprocessflow` (`id`, `status`, `processedBy`, `step`, `nextStep`, `currentStatus`, `description`, `listAction`) VALUES
(1, 'MLIS001', 'MTP1', 1, 'MLIS002', '1st Step Process is currently ongoing.', 'Specimen has been pickup and processed by: <user>', 'Process Specimen'),
(2, 'MLIS002', 'MTP1ONGOING', 2, 'MLIS003|MLIS00D', 'Ongoing 2nd Process|Rejected Specimen', 'Specimen data has been updated.|Rejected covid specimen', 'For Processing|Invalid Speciment'),
(3, 'MLIS003', 'MTP2', 3, 'MLIS004', '2nd Step Process is currently ongoing.', 'Specimen has been pickup and processed by: <user>', 'Process Specimen'),
(4, 'MLIS004', 'MTP2ONGOING', 4, 'MLIS005|MLIS00D', 'Ongoing 3rd Process|Rejected Specimen', 'Specimen data has been updated.|Rejected covid specimen', 'For Reagent Preparation|Invalid Speciment'),
(5, 'MLIS005', 'MTP3', 5, 'MLIS006', '3rd Step Process is currently ongoing.', 'Specimen has been pickup and processed by: <user>', 'Prepare Specimen'),
(6, 'MLIS006', 'MTP3ONGOING', 6, 'MLIS007|MLIS010|MLIS00D', 'Ongoing 4th Process|Encoding Test Results|Rejected Specimen', 'Specimen data has been updated.|Specimen is passed for Verification|Rejected covid specimen', 'For Amplipication|For Test Result Encoding|Invalid Speciment'),
(7, 'MLIS007', 'MTP4', 7, 'MLIS008', '4th Step Process is currently ongoing.', 'Specimen has been pickup and processed by: <user>', 'Evaluate Specimen'),
(8, 'MLIS008', 'MTP4ONGOING', 8, 'MLIS010|MLIS00D', 'Encoding Test Results|Rejected Specimen', 'Specimen data has been updated.|Rejected covid specimen', 'For Test Result Encoding|Invalid Speciment'),
(9, 'MLIS009', 'MTV', 9, 'MLIS00R|MLIS00D', 'Awaiting to release result|Rejected Specimen', 'Specimen result has been verified and checked by <user>.|Rejected covid specimen', 'Verify|Invalid Specimen'),
(10, 'MLIS010', 'ENCODER', 10, 'MLIS011A|MLIS00D', 'Pending for approval|Rejected Specimen', 'Specimen has been checked and issued the Test Result.|Rejected covid specimen', 'Encode Data|Invalid Specimen'),
(11, 'MLIS011A', 'APPROVER', 11, 'MLIS009|MLIS00D', 'Specimen is currently validating and verifying|Rejected Specimen', 'Test Result has been approved and updated.|Rejected covid specimen', 'Approve Result|Invalid Specimen'),
(12, 'MLIS00R', 'RELEASING', 12, 'MLIS00X', 'Test Result Complete', 'Test result has been released.', 'Release'),
(13, 'MLIS00X', 'COMPLETE', 13, '', '', '', ''),
(14, 'MLIS00D', 'INVALID', 14, 'MLIS000', 'Invalid covid specimen and needed to re-test.', 'Request has been approved by: <user> Re-scheduled Status: <schedule>|Request has been cancel by <user> in a reason of: <remarks>', 'Re-process'),
(15, 'MLIS000', 'RECEIVED', 14, 'MLIS001', 'Specimen is pending for proceesing.', 'Specimen has been received and send to processing of samples.', 'Recieve and Send Specimen'),
(16, 'MLISAT000', 'ANTIGEN1 - ENCODER', 1, 'MLISAT001', 'Antigen Test Result Approval', 'Antigen specimen has been updated test result and verified.', 'Submit Antigen Result'),
(17, 'MLISAT001', 'ANTIGEN1 - APPROVER', 1, 'MLISAT00R', 'Antigen Test Result is on Releasing', 'Antigen specimen has been approve and updated.', 'Approve Antigen Specimen'),
(18, 'MLISAT00R', 'ANTIGEN1 - RELEASING', 1, 'MLISAT00X', 'Antigen test result released and completed.', 'Antigen specimen has been released.', 'Release Antigen Result'),
(19, 'MLISAT00X', 'COMPLETED', 1, '', '', '', ''),
(20, 'SPCR000', 'RECEIVED', 1, 'SPCR001', 'Approved on the 1st stage and move to final approval of the result', 'Specimen has been approve in the first action and send to final approval of the report.', 'Approve'),
(21, 'SPCR00X', 'COMPLETED', 2, '', '', '', ''),
(22, 'SPCR001', 'FINAL APPROVAL', 1, 'SPCR00R', 'Approved on the final stage and move to releasing', 'Specimen has been received and send to releasing to print report.', 'Approve'),
(23, 'SPCR00R', 'RELEASING', 1, 'SPCR00X', 'Releasing and printing of the application', 'Specimen has been released.', 'Release Result');

-- --------------------------------------------------------

--
-- Table structure for table `tblschedule`
--

CREATE TABLE `tblschedule` (
  `id` int(11) NOT NULL,
  `patientId` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `scheduleDate` timestamp NULL DEFAULT NULL,
  `scheduleEnd` timestamp NULL DEFAULT NULL,
  `remarks` text NOT NULL,
  `createdBy` int(11) NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblschedule`
--

INSERT INTO `tblschedule` (`id`, `patientId`, `clientId`, `scheduleDate`, `scheduleEnd`, `remarks`, `createdBy`, `createdDate`, `status`) VALUES
(1, 3, 6, '2023-06-02 01:00:00', '2023-06-02 01:30:00', 'Need some vaccine', 4, '2023-05-29 14:37:40', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblusers`
--

CREATE TABLE `tblusers` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `middleName` varchar(255) NOT NULL,
  `suffix` varchar(255) NOT NULL,
  `userType` int(11) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `branchId` int(11) NOT NULL,
  `profilePhoto` longtext NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `isFirstLogin` int(11) NOT NULL DEFAULT 0,
  `userInterface` varchar(25) NOT NULL DEFAULT 'MIS',
  `isDeleted` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblusers`
--

INSERT INTO `tblusers` (`id`, `username`, `password`, `firstName`, `lastName`, `middleName`, `suffix`, `userType`, `contact`, `address`, `branchId`, `profilePhoto`, `status`, `isFirstLogin`, `userInterface`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(1, 'superadmin', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'DVS', 'Supplies Trading', 'Pet', '', 1, '09876543212', '', 1, '', 1, 1, 'DSIS', 0, '2023-05-24 15:30:48', '2023-05-24 15:30:48'),
(2, 'agent1', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'DVSPST', 'Agent', '', '', 3, '09876543212', '', 1, '', 1, 1, 'DSIS', 0, '2023-05-24 15:30:48', '2023-05-24 15:30:48'),
(3, 'accounting1', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'DVSPST', 'Accounting', '', '', 4, '09876543212', '', 1, '', 1, 1, 'DSIS', 0, '2023-05-24 15:30:48', '2023-05-24 15:30:48'),
(4, 'dvsvet', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'DVSPST', 'Vet', '', '', 2, '09876543212', '', 1, '', 1, 1, 'VCLNC', 0, '2023-05-24 15:30:48', '2023-05-24 15:30:48'),
(5, 'client123', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'Jommel', 'Cabiles', 'F', '', 15, '09876543212', 'test address', 1, '', 1, 0, 'VCLNC', 0, '2023-05-24 15:30:48', '2023-05-24 15:30:48'),
(6, 'dqapS', '93c7c9ecad806a88acdc5a2f6d99a144bed6f0c6', 'RONALYN TAN', 'RIVERA', '', '', 15, '09754898638', 'HOMESTEAD - I, TALAVERA, NUEVA ECIJA', 1, '', 1, 0, 'VCLNC', 0, '2023-05-26 12:59:15', '2023-05-26 12:59:15'),
(7, 'UraVy', '93c7c9ecad806a88acdc5a2f6d99a144bed6f0c6', 'KELLY', 'MAG ISA', '', '', 15, '09770279387', 'HOMESTEAD - II, TALAVERA, NUEVA ECIJA', 1, '', 1, 0, 'VCLNC', 0, '2023-05-26 13:26:32', '2023-05-26 13:26:32'),
(8, 'nsXLS', '93c7c9ecad806a88acdc5a2f6d99a144bed6f0c6', 'LORENZ ANNE', 'VALEROSO', '', '', 15, '09056065763', 'HOMESTEAD - II, TALAVERA, NUEVA ECIJA', 1, '', 1, 0, 'MIS', 0, '2023-05-26 13:30:33', '2023-05-26 13:30:33'),
(9, 'WhxNE', '93c7c9ecad806a88acdc5a2f6d99a144bed6f0c6', 'JENNIFER', 'LINSANGAN', '', '', 15, '097541779904', 'BALUGA, TALAVERA, NUEVA ECIJA', 1, '', 1, 0, 'MIS', 0, '2023-05-26 13:36:06', '2023-05-26 13:36:06');

-- --------------------------------------------------------

--
-- Table structure for table `tblusertypes`
--

CREATE TABLE `tblusertypes` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `modules` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblusertypes`
--

INSERT INTO `tblusertypes` (`id`, `description`, `modules`) VALUES
(1, 'Super Admin', '101,106,104,107'),
(2, 'Vet', '101,102,103,104,105'),
(3, 'Agent', '101,102,103,104,105'),
(4, 'Accounting', '101,102,103,104,105'),
(15, 'Client', '101');

-- --------------------------------------------------------

--
-- Table structure for table `tblwellness`
--

CREATE TABLE `tblwellness` (
  `id` int(11) NOT NULL,
  `patientId` int(11) NOT NULL,
  `vaxName` text NOT NULL,
  `vaxClassification` text NOT NULL,
  `vaxRemarks` text NOT NULL,
  `vaxDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_files`
--

CREATE TABLE `tbl_files` (
  `id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `file_content` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblbranches`
--
ALTER TABLE `tblbranches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblcheckups`
--
ALTER TABLE `tblcheckups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbldistribution`
--
ALTER TABLE `tbldistribution`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblpatient_info`
--
ALTER TABLE `tblpatient_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblprocessflow`
--
ALTER TABLE `tblprocessflow`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblschedule`
--
ALTER TABLE `tblschedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblusers`
--
ALTER TABLE `tblusers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblusertypes`
--
ALTER TABLE `tblusertypes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblwellness`
--
ALTER TABLE `tblwellness`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_files`
--
ALTER TABLE `tbl_files`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblbranches`
--
ALTER TABLE `tblbranches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tblcheckups`
--
ALTER TABLE `tblcheckups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbldistribution`
--
ALTER TABLE `tbldistribution`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tblpatient_info`
--
ALTER TABLE `tblpatient_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tblprocessflow`
--
ALTER TABLE `tblprocessflow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tblschedule`
--
ALTER TABLE `tblschedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tblusers`
--
ALTER TABLE `tblusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tblusertypes`
--
ALTER TABLE `tblusertypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tblwellness`
--
ALTER TABLE `tblwellness`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_files`
--
ALTER TABLE `tbl_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
