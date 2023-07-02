<?php

namespace App\Models;

use CodeIgniter\Model;

class MobileModel extends Model
{
    protected $table      = 'tblmobile_sync';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['agentId', 'category', 'client', 'booking'];

    protected $useTimestamps = false;
    // protected $createdField  = 'syncDate';
    // protected $updatedField  = 'updatedDate';
    // protected $deletedField  = 'deleted_at';

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = true;
    

    public function getAllAgentSyncCalls($where){

        $query = $this->db->table($this->table)->where("agentId", $where['agentId'])->like("syncDate", $where['syncDate'])->get();
        $results = $query->getRow();
        return $results;
    }
}