<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php'))
{
	require SYSTEMPATH . 'Config/Routes.php';
}

/**
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/', 'Home::index');

$routes->group('mlrs/api/v1', function($routes){
	$routes->group('auth', function($routes){
		$routes->post('login', 'Auth::login');
		$routes->post('getVersion', 'Auth::validateAppVersion');
		$routes->post('firstLoginChange', 'Auth::firstLoginChangePassword');
	}); 


	// Client and Patient API
	$routes->group('client', function($routes){
		$routes->post('generate', 'Client::registerClient');
		$routes->get('clientList', 'Client::getAllClientList');
		$routes->post('get/patient/list', 'Client::getClientPatientList');
		$routes->post('search/store', 'InventoryController::getStoreInfoSearch');
	});

	// Patient Group
	$routes->group('patient', function($routes){
		$routes->post('add/new', 'Client::registerPet');
		$routes->post('add/schedule', 'Client::addSchedule');
		$routes->post('add/checkup', 'Client::addCheckup');
		$routes->post('add/wellness', 'Client::addWellness');
		$routes->post('details', 'Client::getPatientDetails');
		$routes->post('get/schedule', 'Client::getPatientSchedule');
		$routes->post('update/schedule', 'Client::updatePatientSchedule');
		$routes->post('get/checkup', 'Client::getPatientCheckups');
		$routes->post('get/wellness', 'Client::getPatientWellnes');
		$routes->get('details/schedule/(:num)', 'Client::getPatientScheduleDetail/$1');
	});

	// Product Group
	$routes->group('product', function($routes){
		$routes->post('add/new', 'InventoryController::addProduct');
		$routes->post('add/bulk', 'InventoryController::addBulkProduct');
		$routes->post('update/details', 'InventoryController::updateProduct');
		$routes->post('get/products', 'InventoryController::getProductList');
		$routes->post('get/products/search', 'InventoryController::getProductSearchList');
		$routes->post('get/detail', 'InventoryController::getProductDetail');
	});

	$routes->group('transaction', function($routes){
		$routes->post('temp/list', 'InventoryController::temporaryTransactions');
		$routes->post('temp/list/pending', 'InventoryController::temporaryPendingTransactions');
		$routes->post('temp/create/order', 'InventoryController::temporaryOrderCreate');
		$routes->post('temp/create/collection', 'InventoryController::collectionAmountCreate');
		$routes->post('temp/update/collection', 'InventoryController::collectionAmountUpdate');
		$routes->post('temp/list/collections', 'InventoryController::collectionList');
		$routes->post('temp/update/order', 'InventoryController::temporaryOrderUpdate');
		$routes->post('temp/reference', 'InventoryController::getReferenceContinues');
		$routes->post('temp/reference/directOrder', 'InventoryController::getReferenceDirectContinues');

	});

	// Distribution Processflow 
	$routes->group('distribution', function($routes){
		$routes->post('setTimeIn', 'Distribution::createTimeInAgent');
		$routes->post('getTimeInDetails', 'Distribution::getTimeInAgent');
		$routes->post('addClient', 'Distribution::addNewClient');
		$routes->post('getAllClients', 'Distribution::getClientList');
		$routes->post('create/order', 'InventoryController::temporaryOrderCreateAgent');
		$routes->post('order/list', 'InventoryController::temporaryTransactionsAgent');
		$routes->post('delivery/list', 'InventoryController::temporaryTransactionsDelivery');

		// Admin Activity
		$routes->post('activity/list', 'InventoryController::activityList');
		$routes->post('add/activity', 'InventoryController::createAdminActivity');
	});
	

	// Stock Group
	$routes->group('stock', function($routes){
		$routes->post('add/new', 'InventoryController::addStock');
		$routes->post('add/bulk', 'InventoryController::addStockBulk');
		$routes->post('add', 'InventoryController::addUpdateStock');
		$routes->post('get/stocks', 'InventoryController::getStockList');
		
		// Stock specs
		$routes->post('get/categories', 'InventoryController::getCategories');
		$routes->post('get/units', 'InventoryController::getUnits');
	});

	// Invoice Group
	$routes->group('invoice', function($routes){
		$routes->post('create', 'InvoiceController::createInvoice');
		$routes->post('update', 'InvoiceController::updateInvoice');
		$routes->post('create/booking', 'InvoiceController::createBookingInvoice');
		$routes->post('fetch/byId', 'InvoiceController::getInvoiceDetails');
		$routes->get('fetch/list', 'InvoiceController::fetchInvoice');
	});

	
	// Generate PDF's and Reports
	$routes->group('generate', function($routes){
		$routes->post('invoice', 'Generate::createInvoice');
		$routes->get('print/invoice/(:any)', 'Generate::generateInvoicePdf/$1');
	});

	// Miscellenious
	$routes->group('misc', function($routes){
		$routes->get('userTypes', 'Misc::getUserTypes');
	});

	// Voucher Management
	$routes->group('voucher', function($routes){
		$routes->get('reference', 'Voucher::createVoucherNumber');
		$routes->post('add', 'Voucher::addVoucher');
		$routes->get('list', 'Voucher::getVoucherList');
		$routes->get('list/postdated', 'Voucher::getVoucherListPostdated');
	});


	// All Users mmodule
	$routes->group('users', function($routes){
		$routes->post('create', 'Users::registerUser');
		$routes->post('create/agent', 'Users::registerUserAgent');
		$routes->get('getUsersList', 'Users::getAllUserList');
		$routes->post('changePassword', 'Users::ChangePassword');
		$routes->post('getUserById', 'Users::getUserDetails');

		// For the Mobile App API's
		$routes->get('getAgents', 'Users::getAgentUsers');
		$routes->get('getDeliveryAgents', 'Users::getDeliveryAgentUsers');
	});


	// Distribution Processflow 
	$routes->group('processflow', function($routes){
		$routes->post('getStatus', 'ProcessFlow::getProcessStatus');
		$routes->post('updateStatus', 'ProcessFlow::updateProcessStatus');
		$routes->post('preEncodeStatus', 'ProcessFlow::updatePreProcessStatus');
		$routes->post('updateStatusMultiple', 'ProcessFlow::updateProcessStatusMultiple');
	});
	
	// Dashboard
	$routes->group('dashboard', function($routes){
		$routes->post('getScheduleList', 'DashboardController::fetchScheduleList');
		$routes->get('getDashboard', 'DashboardController::fetchDashboard');
	});

	


	// Mobile Application
	$routes->group('mobile', function($routes){

		$routes->post('sync/data', 'MobileController::syncAgentData'); 
		$routes->post('client/list', 'MobileController::agentClientList');
		$routes->post('get/photo', 'MobileController::agentClientPhoto');
		$routes->post('get/booking', 'MobileController::agentClientBooking');
		$routes->post('agent/callSummary', 'MobileController::agentCallSummaryList');

		// Get Order List
		$routes->post('fetch/order/list', 'MobileController::OrderList');
		$routes->post('create/order', 'MobileController::createOrder');

		// Mobile Fetch Updated Products
		$routes->get('fetch/product/list', 'MobileController::migrateProductsToMobile');

		// for Clients
		$routes->get('fetch/client/list', 'MobileController::clientList');
		$routes->post('fetch/client/agent', 'MobileController::agentIdClientList');
		$routes->get('fetch/client/admin', 'MobileController::adminClientList');
		$routes->post('client/migrate', 'MobileController::migrateClient');
		$routes->post('client/update', 'MobileController::updateClient');

		// For Product
		$routes->post('product/migrate', 'MobileController::migrateProducts');
		$routes->post('product/update', 'MobileController::updateProductList');
	});


	// Announcement mmodule
	$routes->group('announcement', function($routes){
		$routes->post('create', 'Announcement::saveAnnouncement');
		$routes->post('update', 'Users::registerUser');
		$routes->post('delete', 'Users::registerUser');
		$routes->get('getList', 'Announcement::getAnnouncementList');
		$routes->get('public/getList', 'Announcement::getAnnouncementListPublic');
	});
	// Program mmodule
	$routes->group('program', function($routes){
		$routes->get('public/getList', 'Announcement::getProgramListPublic');
	});


});


/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php'))
{
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}

