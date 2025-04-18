<?php

namespace App\Models;

use CodeIgniter\Model;

class InventoryModel extends Model
{
    protected $tableProducts    = 'tblproducts';
    protected $tableStocks    = 'tblstocks';
    protected $tableCategories    = 'tblcategory';
    protected $tableUnits    = 'tblunits';
    protected $tableAttendance    = 'tblattendance';
    protected $tableTempOrder    = 'tbltemp_transaction';
    protected $tableAdmin    = 'tbladmin';
    protected $tableCollection    = 'tblcollections';
    protected $clientsTable    = 'tblclients';

    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['productName', 'unit', 'description', 'category', 'sku', 'stock', 'productCost', 'productSRP', 'hasPriceGroup', 'costGroup', 'isSpecial', 'isSale', 'createdBy'];

    protected $useTimestamps = false;
    protected $createdField  = 'createdDate';
    protected $updatedField  = 'updatedDate';
    // protected $deletedField  = 'deleted_at';

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;

    // Insert Product
    public function insertProduct($data){
        $query = $this->db->table($this->tableProducts)->insert($data);
        return $query ? true : false;
    }
    
    public function updateProduct($where, $setData){

        $query = $this->db->table($this->tableProducts)->set($setData)->where($where)->update();
        return $query ? true : false;

    }

    // Get Products
    public function getProductList() {

        $query = $this->db->table($this->tableProducts)->get();
        $results = $query->getResult('array');
        return $results;
    }
    public function getProductListSearch($searchParam) {
        $sql = "SELECT * FROM tblproducts a, tblstocks b  WHERE a.id = b.productId AND a.productName LIKE '%".$searchParam."%' AND b.quantity > 0";

        $query = $this->db->query($sql);
        $results = $query->getResult('array');
        return $results;
        // $query = $this->db->table($this->tableProducts)->like('productName', $searchParam)->get();
        // $results = $query->getResult('array');
        // return $results;
    }

    // Get Stocks
    public function getStockList() {

        $sql = "SELECT * FROM tblstocks a, tblproducts b WHERE a.productId = b.id";

        $query = $this->db->query($sql);
        $results = $query->getResult('array');
        return $results;
    }

    // Stock

    public function checkStockExist($id){
        $query = $this->db->table($this->tableStocks)->where('productId', $id)->get();
        $results = $query->getRow();
        return $results;
    }
    public function insertStock($data){
        $query = $this->db->table($this->tableStocks)->insert($data);
        return $query ? true : false;
    }
    public function addStockItem($where, $qty){
        $query = $this->db->table($this->tableStocks)->set('quantity', 'quantity+'.(int)$qty, false)->where($where)->update();
        return $query ? true : false;
    }
    public function updateStockItems($where, $qty){
        $query = $this->db->table($this->tableStocks)->set('quantity', 'quantity-'.(int)$qty, false)->where($where)->update();
        return $query ? true : false;
    }

    // Get Specs
    public function getCategories() {

        $query = $this->db->table($this->tableCategories)->get();
        $results = $query->getResult('array');
        return $results;
    }

    public function getUnits() {

        $query = $this->db->table($this->tableUnits)->get();
        $results = $query->getResult('array');
        return $results;
    }


    // Temporary Order
    public function insertToTemporaryOrder($data){
        $query = $this->db->table($this->tableTempOrder)->insert($data);
        return $query ? true : false;
    }
    public function updateToTemporaryOrder($data, $id){
        $query = $this->db->table($this->tableTempOrder)->set($data)->where('id', $id)->update();
        return $query ? true : false;
    }
    public function getStoreList() {
        $query = $this->db->table($this->tableTempOrder)
                      ->where('referenceNumber !=', '') // Exclude rows with empty referenceNumber
                      ->orderBy('id', 'DESC')
                      ->get();
        $results = $query->getResult('array');
        foreach($results as $key => $value){
            $results[$key]['orderItem'] = json_decode($results[$key]['orderItem'], true);
        }
        return $results;
    }
    public function getPendingStoreList() {
        $query = $this->db->table($this->tableTempOrder)
                      ->where('referenceNumber', '') // Fetch rows with blank referenceNumber
                      ->orderBy('id', 'DESC')
                      ->get();
        $results = $query->getResult('array');
        foreach($results as $key => $value){
            $results[$key]['orderItem'] = json_decode($results[$key]['orderItem'], true);
        }
        return $results;
    }
    public function getOrderListAgent($where) {
        $query = $this->db->table($this->tableTempOrder)->where($where)->orderBy('id', 'DESC')->get();
        $results = $query->getResult('array');
        foreach($results as $key => $value){
            $results[$key]['geoTag'] = json_decode($results[$key]['geoTag'], true);
            $results[$key]['orderItem'] = json_decode($results[$key]['orderItem'], true);
        }
        return $results;
    }
    public function getStores($searchParam) {

        $query = $this->db->table($this->tableTempOrder)->like('storeName', $searchParam)->get();
        $results = $query->getResult('array');
        return $results;
    }

    // Attendance
    public function addOrderCount($where, $lastOrder){
        $query = $this->db->table($this->tableAttendance)->set('orderCount', 'orderCount+1', false)->set('lastOrderTakenDateTime',  $lastOrder)->where($where)->update();
        return $query ? true : false;
    }


    // Get Admin
    public function insertAdminActivity($data){
        $query = $this->db->table($this->tableAdmin)->insert($data);
        return $query ? true : false;
    }
    public function getActivityList($where) {
        $query = $this->db->table($this->tableAdmin)
                    ->where($where)
                    ->orderBy('id', 'DESC')
                    ->get();
        $results = $query->getResult('array');

        return $results;
    }

    // Get Collections
    public function insertCollectionAmount($data){
        $query = $this->db->table($this->tableCollection)->insert($data);
        return $query ? true : false;
    }
    public function updateCollectionAmount($data, $id){
        $query = $this->db->table($this->tableCollection)->set($data)->where('id', $id)->update();
        return $query ? true : false;
    }
    public function getCollectionList($where) {
        $query = $this->db->table($this->tableCollection)
                    ->where($where)
                    ->orderBy('id', 'DESC')
                    ->get();
        $results = $query->getResult();

        $all = array_map(function($el){
            foreach($el as $key => $val){
                $clientInfo = $this->db->table($this->clientsTable)->where('id', $el->clientId)->get();
                $el->customerInfo = $clientInfo->getRow();
            }
            return $el;
        }, $results);

        return $all;
    }



}