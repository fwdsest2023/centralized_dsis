<?php namespace App\Controllers;

use CodeIgniter\HTTP\IncomingRequest;
use App\Models\MobileModel;

class MobileController extends BaseController
{

    public function __construct(){
        $this->mobModel = new MobileModel();
    }

    public function syncAgentData(){
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

        // get the data
        $payload = $this->request->getJSON();
        $dataList = $payload->listData;
        $clientList = [];
        $bookingList = [];

        foreach ($dataList as $key => $value) {
            $clientList[$key] = [
                "storeName" => $value->client->storeName,
                "address" => $value->client->address,
                "branch" => $value->client->branch,
                "regionId" => $value->client->regionId,
                "categoryId" => $value->client->categoryId,
                "geoLocation" => $value->client->geoLocation,
                "type" => $value->client->type,
                "contactPerson" => $value->client->contactPerson,
                "attendance" => $value->attendance,
                "remarks" => $value->remarks,
                "files" => $value->files,
            ];

            $bookingList[$key] = [
                "client" => $clientList[$key],
                "booking" => $value->booking
            ];
        }


        $data = [
            "agentId" => $payload->agentId,
            "category" => $payload->category,
            "client" => json_encode($clientList),
            "booking" => json_encode($bookingList)
        ];
        
        // echo '<pre>';
        // print_r($data);
        // exit();
        $query = $this->mobModel->insert($data);

        if($query){

            $response = [
                'title' => 'Sync Complete',
                'message' => 'data hasbeen successfully sync to database'
            ];
 
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            
        } else {
            $response = [
                'title' => 'Sync Failed!',
                'message' => 'Something is went wrong',
                'error' => $query
            ];
 
            return $this->response
                    ->setStatusCode(400)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }
    } 

}