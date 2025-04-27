<?php

namespace App\Models;

use CodeIgniter\Model;

class VoucherModel extends Model
{
    protected $table      = 'tblcheck_voucher';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['voucherNumber', 'invoiceNumber', 'vendor', 'bank', 'checkNumber', 'checkDate', 'particulars', 'type', 'checkType','amount', 'receivedBy', 'approveBy', 'createdBy', 'receiveDate'];

    protected $useTimestamps = false;
    // protected $createdField  = 'createdDate';
    // protected $deletedField  = 'deleted_at';

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;

    // Get List of Vouchers
    public function getVoucherList() {
        $query = $this->db->table($this->table)->where("checkType", "voucher")->get();
        $results = $query->getResult();
        return $results;
    }
    public function getVoucherPostdatedList() {
        $query = $this->db->table($this->table)->where("checkType", "postdated")->get();
        $results = $query->getResult();
        return $results;
    }
    public function getVoucherDetails($where) {
        $query = $this->db->table($this->table)->where($where)->get();
        $results = $query->getRow();
        return $results;
    }

    public function updateVoucher($setData, $where){

        $query = $this->db->table($this->table)->set($setData)->where($where)->update();
        return $query ? true : false;

    }
}