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
		$routes->post('firstLoginChange', 'Auth::firstLoginChangePassword');
		$routes->get('reconnect/(:any)', 'Auth::reconnect/$1');
	}); 

	$routes->group('users', function($routes){
		$routes->post('create', 'Users::registerUser');
		$routes->get('getUsersList', 'Users::getAllUserList');
		$routes->post('changePassword', 'Users::ChangePassword');
		$routes->post('getUserById', 'Users::getUserDetails');
	});

	$routes->group('cif', function($routes){
		$routes->post('submit', 'ApplicationController::sendCIFApplication');
		$routes->post('update', 'ApplicationController::updateCIFApplication');
		$routes->post('getPendingList', 'ApplicationController::getApplicationsRequest');
		$routes->post('searchBy/reference', 'ApplicationController::searchSpecimenApplication');
		$routes->post('searchBy/lastname', 'ApplicationController::searchSpecimenApplicationByLastname');
		$routes->post('searchBy/firstname', 'ApplicationController::searchSpecimenApplicationByFirstname');
		$routes->get('getApplicationDetails/(:any)', 'ApplicationController::getApplicationDetails/$1');
	});

	$routes->group('cif/old', function($routes){
		$routes->post('getPendingList', 'ApplicationControllerArchives::getApplicationsRequest');
		$routes->post('searchBy/lastname', 'ApplicationControllerArchives::searchSpecimenApplicationByLastname');
		$routes->post('searchBy/firstname', 'ApplicationControllerArchives::searchSpecimenApplicationByFirstname');
		$routes->post('getApplicationDetails', 'ApplicationControllerArchives::getApplicationDetails');
	});

	$routes->group('fixData', function($routes){
		$routes->post('fix/application', 'ApplicationController::fixDataForms');
	});

	$routes->group('misc', function($routes){
		$routes->get('getUserTypes', 'Misc::getUserTypes');
		$routes->get('getBranches', 'Misc::getBranches');
		$routes->get('getAddress/(:any)', 'Misc::getAddress/$1');

		$routes->post('dashboard', 'Dashboard::getDashboard');
		$routes->post('monthly/result', 'Dashboard::getMonthlyResult');
		$routes->post('weekly/result', 'Dashboard::getWeeklyResult');
	});

	$routes->group('processflow', function($routes){
		$routes->post('getStatus', 'ProcessFlow::getProcessStatus');
		$routes->post('updateStatus', 'ProcessFlow::updateProcessStatus');
		$routes->post('preEncodeStatus', 'ProcessFlow::updatePreProcessStatus');
		$routes->post('updateStatusMultiple', 'ProcessFlow::updateProcessStatusMultiple');
	});

	$routes->group('generate', function($routes){
		$routes->post('download/result', 'Generate::downloadTest');
		$routes->post('download/antigenResult', 'Generate::downloadAntigenTest');
		$routes->post('download/form', 'Generate::downloadForm');
		$routes->get('testResult/(:any)', 'Generate::getTestResult/$1');
		$routes->get('testResult/old/(:any)/(:any)', 'Generate::getOldTestResult/$1/$2');
		$routes->get('testAntigenResult/(:any)', 'Generate::getAntigenTestResult/$1');
		$routes->get('scan/code/(:any)', 'Generate::getScannedCode/$1');
		$routes->get('caseInvestigation/(:any)', 'Generate::generateCIF/$1');
		$routes->post('caseInvestigationReport', 'Generate::cifReports');
		$routes->post('caseInvestigationReport/antigen', 'Generate::cifAntigenReports');
		$routes->get('getCIFDocument', 'Generate::fetchPDFCIF');
	});
	

	$routes->group('verify', function($routes){
		$routes->get('qr/testResult/(:any)', 'Generate::getVerifyTestResultQRCode/$1');
	});

	// Pathology
	$routes->group('pis', function($routes){
		$routes->post('report/submit', 'PathologyAppContoller::createReportData');
		$routes->post('getPendingList', 'PathologyAppContoller::getApplicationsRequest');
		$routes->post('search', 'PathologyAppContoller::getApplicationsSearch');
	});
	$routes->group('processflow/patho', function($routes){
		$routes->post('updateStatus', 'ProcessFlow::updatePathoProcessStatus');
		$routes->post('updateStatusMultiple', 'ProcessFlow::updatePathoProcessStatusMultiple');
	});
	$routes->group('generate/v2', function($routes){
		// Pathology
		$routes->post('download/result', 'PathoGenerate::downloadResult');
		$routes->get('report/pdf/(:any)', 'PathoGenerate::generateReportResult/$1');
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

