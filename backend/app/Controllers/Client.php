<?php namespace App\Controllers;

use CodeIgniter\HTTP\IncomingRequest;
use App\Models\UsersModel;
use App\Models\HistoryModel;
use \Firebase\JWT\JWT;

class Client extends BaseController
{
    public function __construct(){
        //Models
        $this->userModel = new UsersModel();
        $this->historyModel = new HistoryModel();
    }

    public function registerClient(){
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

        //Get API Request Data from NuxtJs
        $n = 5;
        $defaultPassword = "dvspet123";
        $payload = $this->request->getJSON();
        $payload->username = $this->getUserName($n);
        $payload->password = sha1($defaultPassword);
        $payload->userType = 15;
        $payload->branchId = 1;
        $payload->userInterface = "VCLNC";

        $query = $this->userModel->insert($payload);

        if($query){

            $response = [
                'title' => 'Registration Complete',
                'message' => 'User data has been successfully generated.',
                'username'=> $payload->username,
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

    public function registerPet(){
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

        //Get API Request Data from NuxtJs
        $payload = $this->request->getJSON();
        $payload = json_decode(json_encode($payload), true);
        
        $query = $this->userModel->insertPetDetails($payload);

        if($query){

            $response = [
                'title' => 'Registration Complete',
                'message' => 'Pet data has been successfully save.',
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

    public function getAllClientList(){
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

        $where = [
            "userType" => 15,
            "isDeleted" => 0,
            "status" => 1,
        ];
        $list = [];
        $list['list'] = $this->userModel->getAllUserInfo($where);

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

    public function getClientPatientList(){
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
        
        $payload = $this->request->getJSON();
        $where = [
            "clientId" => $payload->uid
        ];
       
        $list = [];
        $list['list'] = $this->userModel->getClientPatients($where);

        if($list){
            $list['message'] = "successfully fetch client patient list";
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



    function getUserName($n) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
     
        for ($i = 0; $i < $n; $i++) {
            $index = rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }
     
        return $randomString;
    }

}