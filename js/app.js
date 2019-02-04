$(()=>{

  const sendEmail = function(){
    var from, email, message, text;
    from = $('#contactName').val();
    email = $('#contactEmail').val();
    message = $('#contactMessage').val();
    text = "Message from: " + from + "\nemail: " + email + "\n\n" + message;
    $.ajax({
      url: 'https://easymailer.herokuapp.com/send',
      data: {
        'to': 'josh.0.edgell@gmail.com',
        'subject': from + ' Sent You a Message',
        'text': text
      },
      method: 'GET',
      success: function(response){
        alert('Message Sent');
      },
      error: function(error){
        console.log(error, 'Something went wrong');
      },
      xhrFields: {
        withCredentials: true
      },
    });
  };


  const $sendButton = $('#sendButton')
  $sendButton.on('click', ()=>{
    sendEmail();
  })

  $('body').scrollspy({ target: '#navbar'})

  const $navbar = $('#navbar');
  $navbar.on('mouseenter', function(){
    $navbar.css('opacity','1');
  })

  $navbar.on('mouseleave', function(){
    $navbar.css('opacity','0.8')
  })

  const $aboutCard = $('#about .card');
  let imageHeight = 0;

  $aboutCard.hover(function(){
    const $image = $(this).find('.aboutImage');
    imageHeight = $aboutCard.find('.card-body').outerHeight() + 1;
    $image.animate({
      height: 0,
      opacity: 0
    }, 1000)
  }, function(){
    const $image = $(this).find('.aboutImage');
    $image.animate({
      height: imageHeight + 'px',
      opacity: 1
    }, 500)
  });

  const $projectCard = $('#projects .card');
  // let $projectCards = $('#projects').find('.card');
  let max = 0;
  for (let i = 0; i < $projectCard.length; i++) {
    if ($projectCard[i].offsetHeight > max) {
      max = $projectCard[i].offsetHeight - 2;
    }
  }
  $projectCard.css('height', max)

  // const $projectCard = $('#projects .card');
  $projectCard.hover(function(){
    const $image = $(this).find('img');
    $image.animate({
      opacity: 0
    }, 1000, function(){
      $image.css('display','none');
    });

  }, function(){
    const $image = $(this).find('img');
    $image.css('display','inline-block');
    $image.animate({
      opacity: 1
    }, 1000, function(){
      $image.css('display','inline-block');
    });
  })

  const $listGroupItem = $('#navbar .list-group-item');
  $listGroupItem.on('mouseenter',function(){
    $(this).find('.list_group_icon').css('display','inline');
  })
  $listGroupItem.on('mouseleave',function(){
    $(this).find('.list_group_icon').css('display','none');
  })

  $(window).on('resize',function(){
    const $image = $aboutCard.find('.aboutImage');
    imageHeight = $aboutCard.find('.card-body').outerHeight() + 1;
    $image.attr('height',imageHeight);
  })

})
