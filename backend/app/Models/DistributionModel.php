<?php

namespace App\Models;

use CodeIgniter\Model;

class DistributionModel extends Model
{
    protected $table      = 'tblattendance';
    protected $tableClient      = 'tblclients';
    protected $primaryKey = 'id';
    protected $returnType     = 'array';

    protected $allowedFields = [
        'userId', 
        'timeInDate', 
        'timeInTime',
        'orderCount',
        'lastOrderTakenTime',
    ];


    public function updateAttendace($where, $setData){
        $query = $this->db->table($this->table)->set($setData)->where($where)->update();
        return $query ? true : false;
    }

    public function getUserAttendance($where){
        $query = $this->db->table($this->table)->where($where)->get();
        $results = $query->getRow();
        return $results;
    }

    public function getListClients(){
        $query = $this->db->table($this->tableClient)->get();
        $results = $query->getResult();
        return $results;
    }
    public function insertClient($data){
        $query = $this->db->table($this->tableClient)->insert($data);
        return $query ? true : false;
    }

}