<?php

namespace App\Models;

use CodeIgniter\Model;

class UsersModel extends Model
{
    protected $table      = 'tblusers';
    protected $typeTable  = 'tblusertypes';
    protected $branchTable= 'tblbranches';
    protected $patientTable= 'tblpatient_info';
    protected $checkupTable= 'tblcheckups';
    protected $scheduleTable= 'tblschedule';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['username', 'password', 'firstName', 'lastName', 'middleName', 'suffix','userType', 'contact', 'address', 'branchId', 'profilePhoto', 'eSignature', 'status'];

    protected $useTimestamps = false;
    protected $createdField  = 'createdDate';
    protected $updatedField  = 'updatedDate';
    // protected $deletedField  = 'deleted_at';

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;


    public function getUserInfo($id){

        $query = $this->db->table($this->table)->where('id', $id)->get();
        $results = $query->getRow();
        return $results;
    }

    public function getAllUserInfo($where){

        $query = $this->db->table($this->table)->where($where)->get();
        $results = $query->getResult('array');

        $all = array_map(function($el){
            foreach($el as $key => $val){
                $type = $this->db->table($this->typeTable)->where('id', $el['userType'])->get()->getRow();
                $el['userTypeDescription'] = $type->description;
                $branch = $this->db->table($this->branchTable)->where('id', $el['branchId'])->get()->getRow();
                $el['branch'] = $branch->branchName;
            }
            return $el;
        }, $results);

        return $all;
    }

    public function updateTenantInfo($where, $setData){

        $query = $this->db->table($this->table)->set($setData)->where($where)->update();
        return $query ? true : false;

    }
    
    public function updatePassword($where, $setData){

        $query = $this->db->table($this->table)->set($setData)->where($where)->update();
        return $query ? true : false;

    }


    // Get PAtients Data
    public function getClientPatients($where){

        $query = $this->db->table($this->patientTable)->where($where)->get();
        $results = $query->getResult('array');

        $all = array_map(function($el){
            foreach($el as $key => $val){
                $owner = $this->db->table($this->table)->where('id', $el['clientId'])->get()->getRow();
                $el['patientOwner'] = $owner;
            }
            return $el;
        }, $results);

        return $all;
    }
    public function insertPetDetails($data){
        $query = $this->db->table($this->patientTable)->insert($data);
        return $query ? true : false;
    }
    public function insertScheduleDetails($data){
        $query = $this->db->table($this->scheduleTable)->insert($data);
        return $query ? true : false;
    }
    public function insertCheckupDetails($data){
        $query = $this->db->table($this->checkupTable)->insert($data);
        return $query ? true : false;
    }


}