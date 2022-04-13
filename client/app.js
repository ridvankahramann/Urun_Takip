$(".matematik").keyup(function() {
  switch ($(this).attr("name")) {
      case "piecce":
        $("#_alert").remove()
        $(".box").val(parseInt($(this).val()/20).toFixed(0))
        $(".parcel").val(parseInt($(this).val()/200).toFixed(0))
        $(".modal-body").append(`<div id="_alert" class="container"><div class="alert alert-success" role="alert"><strong>${parseInt($(this).val()/200).toFixed(0)} Koli, ${parseInt($(this).val()%200/20).toFixed(0)} Kutu, ${parseInt($(this).val()%200%20).toFixed(0)} Adet</strong></div></div>`)
      break;
      case "box":
        $("#_alert").remove()
        $(".piecce").val($(this).val()*10)
        $(".parcel").val($(this).val()/20)
        $(".modal-body").append(`<div id="_alert" class="container"><div class="alert alert-success" role="alert"><strong>${parseInt($(this).val()/20).toFixed(0)} Koli</strong></div></div>`)
      break;
      case "parcel":
        $("#_alert").remove()
        $(".piecce").val($(this).val()*200)
        $(".box").val($(this).val()*20)
        $(".modal-body").append(`<div id="_alert" class="container"><div class="alert alert-success" role="alert"><strong>${parseInt($(this).val()).toFixed(2)} Koli</strong></div></div>`)
      break;
    default:
  }
});

(() => {
  fetch('http://localhost/koli/api/get_all_data')
  .then(response => response.json())
  .then(data => {
    data.forEach((datas,key) => {
      $("#table_row").append(`<tr><td class="text-info">${datas.company}</td><td>${datas.product}</td><td class="text-warning font-italic">${datas.piecce}</td><td>
      <button type="button" class="btn btn-outline-success" id="duzenle" ${(datas.siparis_id > 0 ? 'disabled' : '')}>Değiştir</button>
      <button type="button" class="btn btn-outline-danger"  onclick="remove(${datas.id})" ${(datas.siparis_id > 0 ? "disabled" : "")}>Sil</button>
      <button type="button" class="btn btn-outline-warning" onclick="order_status(${datas.siparis_id})" ${(datas.siparis_id <= 0 ? "disabled" : "")}>Sipariş Durumu</button></td></tr>`)
      document.querySelectorAll('#duzenle')[key].onclick = function(){
        update(datas);
      }
    })
  })
  .catch(error => console.error(error))
})()

class res {
  search(url,data){
    return new Promise((resolve,reject) => {
      fetch(url,{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
    })
  }
}

const search = (e) => {
  const ress = new res();
  ress.search("http://localhost/koli/api/search",{product:e,company:e,piecce:e})
  .then(data => {
    $("#table_row").html("");
    data.forEach((datas,key) => {
      $("#table_row").append(`<tr><td class="text-info">${datas.company}</td><td>${datas.product}</td><td class="text-warning font-italic">${datas.piecce}</td><td>
      <button type="button" class="btn btn-outline-success" id="duzenle" ${(datas.siparis_id > 0 ? 'disabled' : '')}>Değiştir</button>
      <button type="button" class="btn btn-outline-danger"  onclick="remove(${datas.id})" ${(datas.siparis_id > 0 ? "disabled" : "")}>Sil</button>
      <button type="button" class="btn btn-outline-warning" onclick="order_status(${datas.id})">Sipariş Durumu</button></td></tr>`)
      document.querySelectorAll('#duzenle')[key].onclick = function(){
        update(datas);
      }
    })
  })
  .catch(err => console.log(err))
}

const order_status = (id) => {
  let order_status_id = {siparis_id: id}
  $('#orderstatus').html("");
    $.ajax({
    type: "POST",
    url: "http://localhost/koli/api/order_status",
    data: JSON.stringify(order_status_id),
    success: function(data){
     $("#order_Modal").modal('show');
      data.forEach((datas,key) => {
        $('#orderstatus').append(`<tr><th scope="row" class="text-info">${datas.company}</th><td>${datas.product}</td><td class="text-warning">${datas.piecce}</td><td class="text-success">${datas.durum_isim}</td></tr>`);
      })
    }
  });
}

document.querySelector("#form").addEventListener("submit",function(e){
  let urunler = {
   id:$('input[name="id"]').val(),
   company:$('#company').val(),
   product:$('#product').val(),
   piecce:$('#piecce').val(),
   box:$('#box').val(),
   parcel:$('#parcel').val()
 }
  if ($('input[name="id"]').val()) {
   $.ajax({
     type: "POST",
     url: "http://localhost/koli/api/update",
     data: JSON.stringify(urunler),
   });
   window.location.reload(true);
   $("#exampleModal").modal('hide');
  }else {
   $.ajax({
     type: "POST",
     url: "http://localhost/koli/api/save",
     data: JSON.stringify(urunler),
   });
   window.location.reload(true);
   $("#exampleModal").modal('hide');
  }
 e.preventDefault();
});

const Modal_Test = () => {
  $("#form_id").val("")
  $("#_alert").remove()
  for (var i = 0; i < $("form#form input[type=text]").length; i++) {
    $("form#form input[type=text]").eq(i).val("");
  }
  $('#exampleModal').modal('show');
  $('#save_button').html('Kaydet');
  $('.modal-title').html('Kayıt Formu');
}

const update = (data) => {
  $("#_alert").remove()
  $('#exampleModal').modal('show');
  $('#save_button').html('Düzenle');
  $('.modal-title').html('Düzenle Formu');
  let urunler = {
    id:$('input[name="id"]').val(data.id),
    company:$('#company').val(data.company),
    product:$('#product').val(data.product),
    piecce:$('#piecce').val(data.piecce),
    box:$('#box').val(data.box),
    parcel:$('#parcel').val(data.parcel)
  }
}

const remove = (id) => {
  swal({
    title: "Emin misiniz?",
    text: "Silinecek!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      let remove_id = {id: id}
      $.ajax({
        type: "DELETE",
        url: "http://localhost/koli/api/delete",
        data: JSON.stringify(remove_id),
      });
      swal("Başarıyla Silindi!", {
        icon: "success",
      });
      window.location.reload(true);
    } else {
      swal("Silinmedi!");
    }
  });
}
