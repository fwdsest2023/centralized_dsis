<?php namespace App\Controllers;

use CodeIgniter\HTTP\IncomingRequest;
use App\Models\MobileModel;

class MobileController extends BaseController
{

    public function __construct(){
        $this->mobModel = new MobileModel();
    }

    public function syncAgentData(){
        try {
            // get the data
            $payload = $this->request->getJSON();
            $dataList = json_decode($payload->listData);
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
                    "clientId" => $key,
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
        } catch (\Throwable $th) {
            throw $th;
        }
    } 

    public function agentClientList(){
        try {
            // get the data
            $payload = $this->request->getJSON();
            $list = [];
            $where = [
                "agentId" => $payload->aid,
                "syncDate" => $payload->date
            ];

            $query = $this->mobModel->getAllAgentSyncCalls($where);
            
            if($query){
                $client = json_decode($query->client);
                $bookings = json_decode($query->booking);
                // print_r(gettype($client));
                // print_r($bookings);
                // exit();
                foreach ($client as $key => $value) {
                    // print_r($value);
                    $booking = $bookings[$key]->booking;
                    // print_r($booking);

                    $list['list'][$key] = [
                        "storeName" => $value->storeName,
                        "address" => $value->address,
                        "branch" => $value->branch,
                        "categoryId" => $value->categoryId,
                        "geoLocation" => $value->geoLocation,
                        "contactPerson" => $value->contactPerson,
                        "attendance" => $value->attendance,
                        "remarks" => $value->remarks,
                        "books" => $booking,
                        "files" => $value->files
                    ];
                }
            } 
            

            if($list){
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
                        ->setStatusCode(404)
                        ->setContentType('application/json')
                        ->setBody(json_encode($response));
            }

        } catch (\Throwable $th) {
            print_r($th);
            throw $th;
        }
    }

    public function agentHistoryList(){
        try {
            // get the data
            $payload = $this->request->getJSON();
            $list = [];
            $where = [
                "agentId" => $payload->aid
            ];

            $query = $this->mobModel->getAllHistoryCalls($where);
            
            if($query){
                $client = json_decode($query->client);
                $bookings = json_decode($query->booking);

                foreach ($client as $key => $value) {
                    // print_r($value);
                    $booking = $bookings[$key]->booking;
                    // print_r($booking);

                    $list['list'][$key] = [
                        "storeName" => $value->storeName,
                        "address" => $value->address,
                        "branch" => $value->branch,
                        "categoryId" => $value->categoryId,
                        "geoLocation" => $value->geoLocation,
                        "contactPerson" => $value->contactPerson,
                        "attendance" => $value->attendance,
                        "remarks" => $value->remarks,
                        "books" => $booking,
                        "files" => $value->files
                    ];
                }
            } 
            

            if($list){
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
                        ->setStatusCode(404)
                        ->setContentType('application/json')
                        ->setBody(json_encode($response));
            }

        } catch (\Throwable $th) {
            print_r($th);
            throw $th;
        }
    }

    public function agentCallSummaryList(){
        try {
            // get the data
            $payload = $this->request->getJSON();
            $list = [];
            $params = [
                "aid" => $payload->aid,
                "dateFrom" => $payload->dateFrom,
                "dateTo" => $payload->dateTo,
            ];

            $query = $this->mobModel->getAllSummaryCalls($params);

            if($query){
                $marr = [];
                foreach ($query as $key => $value) {
                    
                    $clients = $value->client;
                    $clist = $this->segregateClient($clients, $value);
                    $marr = array_merge($marr, $clist['list']);
                }

                $list['list'] = $marr;
                $list['count'] = sizeof($marr);

                // print_r($list);

                // exit();
            } 
            

            if($list){
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
                        ->setStatusCode(404)
                        ->setContentType('application/json')
                        ->setBody(json_encode($response));
            }

        } catch (\Throwable $th) {
            print_r($th);
            throw $th;
        }
    }

    public function segregateClient($arr, $val){
        $clist = [];
        $client = json_decode($arr);
        foreach($client as $ckey => $cvalue){
            $start = strtotime($cvalue->attendance->startCall);
            $end = strtotime($cvalue->attendance->endCall);
            $callDuration = ($end - $start) / 60;

            $clist['list'][$ckey] = [
                "date" => date('m/d/Y', strtotime($val->syncDate)),
                "storeName" => $cvalue->storeName,
                "address" => $cvalue->address,
                "timeIn" => date('h:i:s A', strtotime($cvalue->attendance->startCall)),
                "timeOut" => date('h:i:s A', strtotime($cvalue->attendance->endCall)),
                // "attendance" => $cvalue->attendance,
                "duration" => $callDuration .'min(s)',
                "remarks" => $this->callReamrks($callDuration),
            ];
        }

        return $clist;
    }

    public function callReamrks($mins){
        $rem = 'SHORT CALL';

        if($mins >= 8){
            $rem = 'GOOD';
        }

        return $rem;
    }



}