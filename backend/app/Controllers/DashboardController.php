<?php namespace App\Controllers;

use CodeIgniter\HTTP\IncomingRequest;
use App\Models\UsersModel;
use App\Models\HistoryModel;
use \Firebase\JWT\JWT;

class DashboardController extends BaseController
{
    public function __construct(){
        //Models
        $this->userModel = new UsersModel();
        $this->historyModel = new HistoryModel();
    }

    public function fetchScheduleList(){
        // // Check Auth header bearer
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

        $list = [];

        $query = $this->userModel->getAllSchedules(["scheduleDate"=>$payload->currDate]);

        foreach ($query as $key => $value) {
            $value['vaccineForm'] = json_decode($value['vaccineForm']);
            $list['list'][$key] = [
                "id" => $value['id'],
                "title" => $value['patientDetails']->petName,
                "start" =>  $value['scheduleDate'],
                "details" => $value,
            ];
        }

        if($list){
            $list['message'] = "successfully fetch client list";
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

    public function fetchDashboard(){
        $list = [];

        // Client Count
        $where = [
            "userType" => 15,
            "isDeleted" => 0,
            "status" => 1,
        ];
        $clientCount = $this->userModel->getAllUserInfo($where);

        // Patient count
        $whereP = [
            "isDeceased" => 0
        ];
        $patientCount = $this->userModel->getAllPtientInfo($whereP);

        $list['data'] = [
            "clientCount" => sizeof($clientCount),
            "patientCount" => sizeof($patientCount),
            "todaysSale" => 0,
            "totalSales" => 0,
        ];


        if($list){
            $list['message'] = "successfully fetch dashboard card list";
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