<?php

namespace App\Models;

use CodeIgniter\Model;

class InvoiceModel extends Model
{
    protected $table    = 'tblinvoice';
    protected $clientsTable    = 'tblclients';
    protected $usersTable    = 'tblusers';

    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['invoiceNo', 'agentId', 'syncId','customerId', 'otherDetails','termsOfPayment', 'orderList', 'gross', 'discount', 'netAmount', 'status', 'createdBy'];

    // protected $useTimestamps = false;
    // protected $createdField  = 'createdDate';
    // protected $updatedField  = 'updatedDate';
    // protected $deletedField  = 'deleted_at';

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;

    public function checkGeneratedInvoice($where){
        $query = $this->db->table($this->table)->where($where)->get();
        $results = $query->getRow();
        return $results;
    }
    public function getAllInvoice(){
        $query = $this->db->table($this->table)->get();
        $results = $query->getResult();
        $all = array_map(function($el){

            foreach($el as $key => $val){
                $clientInfo = $this->db->table($this->clientsTable)->where('id', $el->customerId)->get();
                $agentInfo = $this->db->table($this->usersTable)->where('id', $el->agentId)->get();
                $creatorInfo = $this->db->table($this->usersTable)->where('id', $el->createdBy)->get();
                $el->customerInfo = $clientInfo->getRow();
                $el->agentInfo = $agentInfo->getRow();
                $el->issueInfo = $creatorInfo->getRow();
            }
            return $el;
        }, $results);

        return $all;
    }
}