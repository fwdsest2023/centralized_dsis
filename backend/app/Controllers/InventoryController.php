<?php namespace App\Controllers;

use CodeIgniter\HTTP\IncomingRequest;
use App\Models\InventoryModel;
use App\Models\HistoryModel;
use \Firebase\JWT\JWT;

class InventoryController extends BaseController
{
    public function __construct(){
        //Models
        $this->inventoryModel = new InventoryModel();
        $this->historyModel = new HistoryModel();
    }
    
    public function addProduct(){
        // Check Auth header bearer
        $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        if(!$authorization){
            $response = [
                'message' => 'Unauthorized Access'
            ];

            return $this->response
                    ->setStatusCode(401)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            exit();
        }

        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();
        $payload = json_decode(json_encode($payload), true);

        
        // Insert the data
        $query = $this->inventoryModel->insertProduct($payload);

        if($query){
            $response = [
                'title' => 'Product added',
                'message' => 'Product added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }
    }

    public function addBulkProduct(){
        
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();

        // conversion of dateTime
        // $payload = json_decode(json_encode($payload), true);
        $i = 0;
        foreach($payload->list as $key => $value){
            $req = json_decode(json_encode($value), true);
            $this->inventoryModel->insertProduct($req);
            $i++;
        }
        
        
        // Insert the data
        // $query = $this->inventoryModel->insertProduct($payload);

        if($i === sizeof($payload->list)){

            $response = [
                'title' => 'Product added',
                'message' => 'Product added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }


    public function updateProduct(){
        $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        if(!$authorization){
            $response = [
                'message' => 'Unauthorized Access'
            ];

            return $this->response
                    ->setStatusCode(401)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            exit();
        }

        $payload = $this->request->getJSON();
        $where = ['id' => $payload->id];


        $setProductData = [
            'productName' => $payload->productName,
            'supplier' => $payload->supplier,
            'productSRP' => $payload->productSRP,
            'netCost' => $payload->netCost,
            'minSellPrice' => $payload->minSellPrice,
            'maxSellPrice' => $payload->maxSellPrice,
            'commissionType' => $payload->commissionType,
        ];

        //Update Query for finding User Information
        $updateProduct = $this->inventoryModel->updateProduct($where, $setProductData);


        if($updateProduct){
            //save application history action
            // $this->historyModel->insert($history);

            //Return to user
            $response = [
                'title' => 'Update Product Status',
                'message' => 'Product successfully updated!'
            ];

            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        } else {
            $response = [
                'title' => 'Update Request Status',
                'message' => 'Your application failed to update!'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

        
    } 

    public function getProductList(){
        // Check Auth header bearer
        // $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        // if(!$authorization){
        //     $response = [
        //         'message' => 'Unauthorized Access'
        //     ];

        //     return $this->response
        //             ->setStatusCode(401)
        //             ->setContentType('application/json')
        //             ->setBody(json_encode($response));
        //     exit();
        // }

        // $where = [
        //     "userType" => 15,
        //     "isDeleted" => 0,
        //     "status" => 1,
        // ];
        $list = [];
        $list['list'] = $this->inventoryModel->getProductList();

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }
    public function getProductSearchList(){
       
        $payload = $this->request->getJSON();
        $searchTerm = $payload->searchParam ?? '';

        $list = [];
        $list['list'] = $this->inventoryModel->getProductListSearch($searchTerm);

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function getProductDetail(){
        // Check Auth header bearer
        // $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        // if(!$authorization){
        //     $response = [
        //         'message' => 'Unauthorized Access'
        //     ];

        //     return $this->response
        //             ->setStatusCode(401)
        //             ->setContentType('application/json')
        //             ->setBody(json_encode($response));
        //     exit();
        // }

        // $where = [
        //     "userType" => 15,
        //     "isDeleted" => 0,
        //     "status" => 1,
        // ];
        $list = [];
        $list['list'] = $this->inventoryModel->getProductList();

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    // Stocks Part
    public function addStock(){
        // Check Auth header bearer
        // $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        // if(!$authorization){
        //     $response = [
        //         'message' => 'Unauthorized Access'
        //     ];

        //     return $this->response
        //             ->setStatusCode(401)
        //             ->setContentType('application/json')
        //             ->setBody(json_encode($response));
        //     exit();
        // }

        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();

        // conversion of dateTime
        // $payload->scheduleDate = date('c', strtotime($payload->scheduleDate));
        // $payload->costGroup = json_encode($payload->costGroup);
        // $payload->category = json_encode($payload->category);
        // $payload->unit = json_encode($payload->unit);
        $payload = json_decode(json_encode($payload), true);

        
        // Insert the data
        $query = $this->inventoryModel->insertStock($payload);

        if($query){

            $response = [
                'title' => 'Stock added',
                'message' => 'Stock added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }
    public function addStockBulk(){
        
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();

        // conversion of dateTime
        // $payload = json_decode(json_encode($payload), true);
        $i = 0;
        foreach($payload->list as $key => $value){
            // Check if the Stock of Product Already Exist
            $check = $this->inventoryModel->checkStockExist($value->id);
            if($check){
                $req = [
                    'productId' => $value->id
                ];
                $this->inventoryModel->addStockItem($req, $value->quantity);
                $i++;
                continue;
            } else {
                $req = [
                    'productId' => $value->id,
                    'quantity' => $value->quantity,
                    'stockNotice' => $value->stockNotice
                ];
                $this->inventoryModel->insertStock($req);
            }

            $i++;
        }
        
        
        // Insert the data
        // $query = $this->inventoryModel->insertProduct($payload);

        if($i === sizeof($payload->list)){

            $response = [
                'title' => 'Product added',
                'message' => 'Product added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }


    public function addUpdateStock(){

        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();
        
        $where = ['productId' => $payload->id];
        
        // Insert the data
        $query = $this->inventoryModel->addStockItem($where, $payload->quantity);

        if($query){

            $response = [
                'title' => 'Stock added',
                'message' => 'Stock added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function getStockList(){
        // Check Auth header bearer
        // $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        // if(!$authorization){
        //     $response = [
        //         'message' => 'Unauthorized Access'
        //     ];

        //     return $this->response
        //             ->setStatusCode(401)
        //             ->setContentType('application/json')
        //             ->setBody(json_encode($response));
        //     exit();
        // }

        // $where = [
        //     "userType" => 15,
        //     "isDeleted" => 0,
        //     "status" => 1,
        // ];
        $list = [];
        $list['list'] = $this->inventoryModel->getStockList();

        if($list){
            $list['message'] = "successfully fetch stock list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    // Specs
    public function getCategories(){
        // Check Auth header bearer
        // $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        // if(!$authorization){
        //     $response = [
        //         'message' => 'Unauthorized Access'
        //     ];

        //     return $this->response
        //             ->setStatusCode(401)
        //             ->setContentType('application/json')
        //             ->setBody(json_encode($response));
        //     exit();
        // }

        // $where = [
        //     "userType" => 15,
        //     "isDeleted" => 0,
        //     "status" => 1,
        // ];
        $list = [];
        $list['list'] = $this->inventoryModel->getCategories();

        if($list){
            $list['message'] = "successfully fetch stock list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function getUnits(){
        // Check Auth header bearer
        // $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        // if(!$authorization){
        //     $response = [
        //         'message' => 'Unauthorized Access'
        //     ];

        //     return $this->response
        //             ->setStatusCode(401)
        //             ->setContentType('application/json')
        //             ->setBody(json_encode($response));
        //     exit();
        // }

        // $where = [
        //     "userType" => 15,
        //     "isDeleted" => 0,
        //     "status" => 1,
        // ];
        $list = [];
        $list['list'] = $this->inventoryModel->getUnits();

        if($list){
            $list['message'] = "successfully fetch stock list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }



    // Temporary Tranasactions
    public function temporaryTransactions(){
        $list = [];
        $list['list'] = $this->inventoryModel->getStoreList();

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }
    public function temporaryPendingTransactions(){
        $list = [];
        $list['list'] = $this->inventoryModel->getPendingStoreList();

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }
    public function collectionList(){
        $payload = $this->request->getJSON();
        $list = [];
        $list['list'] = $this->inventoryModel->getCollectionList([
            "deliveryDate" => $payload->deliveryDate,
            "status" => 0 
        ]);

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }
    public function temporaryTransactionsAgent(){
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();

        $list = [];
        $list['list'] = $this->inventoryModel->getOrderListAgent([
            "agentId" => $payload->agentId,
            "orderDate" => $payload->orderDate,
        ]);

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }
    public function temporaryTransactionsDelivery(){
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();

        $list = [];
        $list['list'] = $this->inventoryModel->getOrderListAgent([
            "orderStatus" => 2,
            "deliveryDate" => $payload->orderDate,
        ]);

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function temporaryOrderCreate(){
        
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();

        // conversion of dateTime
        // $payload->scheduleDate = date('c', strtotime($payload->scheduleDate));
        $payload->orderItem = json_encode($payload->orderItem);
        $payload = json_decode(json_encode($payload), true);

        
        // Insert the data
        $query = $this->inventoryModel->insertToTemporaryOrder($payload);

        if($query){
            // Foreach the Items
            $items = json_decode($payload['orderItem'], true);
            $i = 0;
            foreach($items as $key => $value){
                $req = [
                    'productId' => $value['id']
                ];
                $this->inventoryModel->updateStockItems($req, $value['quantity']);
                $i++;
            }

            $response = [
                'title' => 'Product added',
                'message' => 'Product added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }
    public function collectionAmountCreate(){
        
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();

        $payload = json_decode(json_encode($payload), true);

        
        // Insert the data
        $query = $this->inventoryModel->insertCollectionAmount($payload);

        if($query){

            $response = [
                'title' => 'Order Floating Collection',
                'message' => 'Floating Collection Added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function temporaryOrderCreateAgent(){
        
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();
        
        $transaction = $payload->transaction;
        $transaction->orderItem = json_encode($transaction->orderItem);
        $transaction->geoTag = json_encode($transaction->geoTag);
        $transaction = json_decode(json_encode($transaction), true);

        
        // Insert the data
        $query = $this->inventoryModel->insertToTemporaryOrder($transaction);

        if($query){

            // update the attendance order
            $attWhere = [
                'userId' => $payload->updateDetails->attendanceId,
                'timeInDate' => $payload->updateDetails->attendanceDate,
            ];
            $this->inventoryModel->addOrderCount($attWhere, $payload->updateDetails->lastOrderDate);

            $response = [
                'title' => 'Product added',
                'message' => 'Product added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }
    public function temporaryOrderUpdate(){
        
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();
        
        $transaction = $payload->updateDetails;
        $transaction->orderItem = json_encode($transaction->orderItem);
        if(isset($transaction->geoTag)){
            $transaction->geoTag = json_encode($transaction->geoTag);
        }
        $transaction = json_decode(json_encode($transaction), true);

        
        // Insert the data
        $query = $this->inventoryModel->updateToTemporaryOrder($transaction, $payload->id);

        if($query){
            // Foreach the Items
            $items = json_decode($transaction['orderItem'], true);
            $i = 0;
            foreach($items as $key => $value){
                $req = [
                    'productId' => $value['id']
                ];
                $this->inventoryModel->updateStockItems($req, $value['quantity']);
                $i++;
            }

            $response = [
                'title' => 'Product added',
                'message' => 'Product added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }
    public function collectionAmountUpdate(){
        
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();
        
        $transaction = $payload->updateDetails;
        $transaction = json_decode(json_encode($transaction), true);
        
        // Insert the data
        $query = $this->inventoryModel->updateCollectionAmount($transaction, $payload->id);

        if($query){
            if(!$payload->isPaid){
                $newCollect = json_decode(json_encode($payload->newCollection), true);
                $this->inventoryModel->insertCollectionAmount($newCollect);
            } 

            // Foreach the Items
            $response = [
                'title' => 'Collection Updated',
                'message' => 'Collection Updated successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function getStoreInfoSearch(){
       
        $payload = $this->request->getJSON();
        $searchTerm = $payload->searchParam ?? '';

        $list = [];
        $list['list'] = $this->inventoryModel->getStores($searchTerm);

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function getReferenceContinues(){
        //Get API Request Data from UI
        $payload = $this->request->getJSON();

        // Check if there was starting loan application on the user
        $result = 'TRA-COM'. sprintf('%06d',  1);
        $query = $this->inventoryModel->getStoreList();

        // if the series is not yet started
        if($query){
            $result = sprintf('TRA-COM%06d', $query[0]['id'] + 1);
        }
        
        if($result){
            $response = [
                "reference" => $result
            ];
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        } else {
            $response = [
                'error' => 404,
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }



    public function createAdminActivity(){
        
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();
        
        $payload = json_decode(json_encode($payload), true);

        
        // Insert the data
        $query = $this->inventoryModel->insertAdminActivity($payload);

        if($query){

            // update the attendance order
            $response = [
                'title' => 'Activity Details',
                'message' => 'Activity added successfully',
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Registration Failed!',
                'message' => 'Please check your data.'
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function activityList(){
        //Get API Request Data from Frontend
        $payload = $this->request->getJSON();

        $list = [];
        $list['list'] = $this->inventoryModel->getActivityList([
            "userId" => $payload->userId,
            "schedule" => $payload->schedule,
        ]);

        if($list){
            $list['message'] = "successfully fetch product list";
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

}