<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {
	public $JSON_DATA;
	public function __construct(){
		parent::__construct();
		$this->load->model("urunler_model");
		$this->output->set_content_type("application/json");
		$this->output->set_header("Access-Controller-Allow-Origin: *");
		$this->output->set_header("Access-Controller-Allow-Method: GET, OPTIONS");
		$this->output->set_header("Access-Controller-Allow-Headers: Content-Type, Content-Lenght, Accept-Encoding");
		$this->JSON_DATA = (array)json_decode(file_get_contents("php://input"));
	}

	public function get_all_data(){
		echo $this->urunler_model->get_all();
	}

	public function save(){
		echo $this->urunler_model->save(
			$this->JSON_DATA
		);
	}

	public function update(){
		$id = $this->JSON_DATA["id"];
		unset($this->JSON_DATA["id"]);

		echo $this->urunler_model->update(
			$this->JSON_DATA,
			array(
				'id' => $id
			)
		);
	}

	public function delete(){
		echo $this->urunler_model->delete(
			$this->JSON_DATA
		);
	}

	public function order_status(){
		echo $this->urunler_model->order_status(
			$this->JSON_DATA
		);
	}

	public function search(){
		echo $this->urunler_model->search(
			$this->JSON_DATA
		);
	}

}
