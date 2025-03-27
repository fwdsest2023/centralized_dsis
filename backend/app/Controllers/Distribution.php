<?php namespace App\Controllers;

use App\Models\UsersModel;
use App\Models\DistributionModel;
use App\Models\AuthModel;
use App\Models\MiscModel;

use function PHPSTORM_META\map;

class Distribution extends BaseController
{
    public function __construct(){
        //Models
        $this->distModel = new DistributionModel();
        $this->userModel = new UsersModel();
        $this->authModel = new AuthModel();
        $this->miscModel = new MiscModel();
    }

    public function createTimeInAgent(){
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
        $data = $this->request->getJSON();

        $query = $this->distModel->insert($data);

        if($query){

            $response = [
                'title' => 'Time Success',
                'message' => 'You can now record order and .'
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

    public function getTimeInAgent(){
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
        $data = $this->request->getJSON(); 

        //Select Query for finding User Information
        $attendance = $this->distModel->getUserAttendance([
            'userId' => $data->userId,
            'timeInDate' => $data->timeInDate
        ]);
        
        //Set Api Response return to the FE
        if($attendance){

            $response = [
                'title' => 'Time In Details',
                'details' => $attendance,
                'message' => 'Successfully fetched time in details.'
            ];

            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        } else {
            $response = [
                'error' => 404,
                'title' => 'No Time In Details',
                'details' => null,
                'message' => 'Please click Clock In button to record your time in.'
            ];

            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }
        
    }


    public function addNewClient(){
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
        $data = $this->request->getJSON();

        $query = $this->distModel->insertClient(json_decode(json_encode($data), true));

        if($query){

            $response = [
                'title' => 'Client Creation',
                'message' => 'Client successfully Added'
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

    public function getClientList(){
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
        $data = $this->request->getJSON(); 

        //Select Query for finding User Information
        $attendance = $this->distModel->getListClients();
        
        //Set Api Response return to the FE
        if($attendance){

            $response = [
                'title' => 'Client List',
                'list' => $attendance,
                'message' => 'Successfully fetched time in details.'
            ];

            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        } else {
            $response = [
                'error' => 404,
                'title' => 'No Client List',
                'list' => [],
                'message' => 'Please click Add Client button to add new client record'
            ];

            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }
        
    }

}