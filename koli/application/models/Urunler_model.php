<?php
class Urunler_model extends CI_Model{

  public $tablename;
  public $tablesiparis;
  public $tabledurum;
  public function __construct(){
    parent::__construct();
    $this->tablename = "urunler";
    $this->tabledurum = "durum";
  }

  public function get_all(){
    return json_encode($this->db->get($this->tablename)->result());
  }

  public function save($data = array()){
    return json_encode($this->db->insert($this->tablename, $data));
  }

  public function update($data = array(), $where = array()){
    return json_encode($this->db->where($where)->update($this->tablename, $data));
  }

  public function delete($where = array()){
    return json_encode($this->db->where($where)->delete($this->tablename));
  }

  public function order_status($where = array()){
    return json_encode($this->db->select()->from($this->tablename)->join($this->tabledurum, "durum.id = urunler.siparis_id")->where($where)->get()->result());
  }

  public function search($data = array()){
    return json_encode($this->db->or_like($data)->get($this->tablename)->result());
  }

}
