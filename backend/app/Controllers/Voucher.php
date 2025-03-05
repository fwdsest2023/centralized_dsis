<?php namespace App\Controllers;

use App\Models\VoucherModel;

class Voucher extends BaseController
{
    protected $vouchModel;

    public function __construct(){
        //Models
        $this->vouchModel = new VoucherModel();
    }
    
    public function createVoucherNumber(){
        $voucherNumber = $this->vouchModel->selectMax('voucherNumber')->first();
    
        if($voucherNumber && !empty($voucherNumber['voucherNumber'])){
            // Explode the voucher number to get the numeric part
            $parts = explode(' ', $voucherNumber['voucherNumber']);
            $number = intval($parts[1]) + 1;
        } else {
            $number = 1;
        }
    
        $prefix = 'TPST'; // Define your prefix here
        $voucherNumber = $prefix . ' ' . str_pad($number, 6, '0', STR_PAD_LEFT);
    
        $response = [
            'status' => 200,
            'error' => null,
            'voucherNumber' => $voucherNumber
        ];
        return $this->response->setStatusCode(200)->setJSON($response);
    }

    public function addVoucher(){
        $data = $this->request->getJSON();
        $data = [
            'voucherNumber' => $data->voucherNumber,
            'vendor' => $data->vendor,
            'checkNumber' => $data->checkNumber,
            'checkDate' => $data->checkDate,
            'checkType' => $data->checkType,
            'particulars' => $data->particulars,
            'bank' => $data->bank,
            'type' => $data->type,
            'amount' => $data->amount,
            'receivedBy' => $data->receivedBy,
            'approveBy' => $data->approvedBy,
            // 'createdBy' => $data->createdBy
        ];
        $this->vouchModel->insert($data);
        $response = [
            'status' => 201,
            'error' => null,
            'message' => [
                'success' => 'Voucher added successfully'
            ]
        ];
        return $this->response->setStatusCode(201)->setJSON($response);
    }

    public function getVoucherList(){
        $vouchers = $this->vouchModel->getVoucherList();

        if($vouchers){
            $response = [
                'status' => 200,
                'error' => null,
                'list' => $vouchers
            ];
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        } else {
            $response = [
                'status' => 400,
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }
        
    }
    public function getVoucherListPostdated(){
        $vouchers = $this->vouchModel->getVoucherPostdatedList();

        if($vouchers){
            $response = [
                'status' => 200,
                'error' => null,
                'list' => $vouchers
            ];
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        } else {
            $response = [
                'status' => 400,
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }
        
    }

}