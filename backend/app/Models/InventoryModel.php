<?php

namespace App\Models;

use CodeIgniter\Model;

class InventoryModel extends Model
{
    protected $tableProducts    = 'tblproducts';
    protected $tableStocks    = 'tblstocks';
    protected $tableCategories    = 'tblcategory';
    protected $tableUnits    = 'tblunits';
    protected $tableTempOrder    = 'tbltemp_transaction';

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
    public function insertStock($data){
        $query = $this->db->table($this->tableStocks)->insert($data);
        return $query ? true : false;
    }
    public function addStockItem($where, $qty){
        $query = $this->db->table($this->tableStocks)->set('quantity', 'quantity+'.$qty, false)->where($where)->update();
        return $query ? true : false;
    }
    public function updateStockItems($where, $qty){
        $query = $this->db->table($this->tableStocks)->set('quantity', 'quantity-'.$qty, false)->where($where)->update();
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
    public function getStoreList() {
        $query = $this->db->table($this->tableTempOrder)->orderBy('id', 'DESC')->get();
        $results = $query->getResult('array');
        foreach($results as $key => $value){
            $results[$key]['orderItem'] = json_decode($results[$key]['orderItem'], true);
        }
        return $results;
    }
    public function getStores($searchParam) {

        $query = $this->db->table($this->tableTempOrder)->like('storeName', $searchParam)->get();
        $results = $query->getResult('array');
        return $results;
    }

}