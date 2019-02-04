$(()=>{

  const $home = $('.mollyInfo');
  const $other = $('.other');
  const $about = $('.about');
  const $contact = $('.contact');

  const homeHeight = $('.main').height();
  $other.css('height',homeHeight);

  const setButtons = function(){
    const $coaching = $('.coachingTab');
    $coaching.on('click',()=>{
      $home.css('display','none');
      $other.css('display','none');
      const $coachingDiv = $('.coaching');
      $coachingDiv.css('display','block');
      const $toggle = $('.toggle');
      $toggle.prop('checked',false);
      cancelButtons();
    })

    const $event = $('.eventTab');
    $event.on('click',()=>{
      $home.css('display','none');
      $other.css('display','none');
      const $eventDiv = $('.event');
      $eventDiv.css('display','block');
      const $toggle = $('.toggle');
      $toggle.prop('checked',false);
      cancelButtons();
    })

    const $faciliation = $('.facilitationTab');
    $faciliation.on('click',()=>{
      $home.css('display','none');
      $other.css('display','none');
      const $facilitationDiv = $('.facilitation');
      $facilitationDiv.css('display','block');
      const $toggle = $('.toggle');
      $toggle.prop('checked',false);
      cancelButtons();
    })

    const $resource = $('.resourceTab');
    $resource.on('click',()=>{
      $home.css('display','none');
      $other.css('display','none');
      const $resourceDiv = $('.resource');
      $resourceDiv.css('display','block');
      const $toggle = $('.toggle');
      $toggle.prop('checked',false);
      cancelButtons();
    })

    const $strategic = $('.strategicTab');
    $strategic.on('click',()=>{
      $home.css('display','none');
      $other.css('display','none');
      const $strategicDiv = $('.strategic');
      $strategicDiv.css('display','block');
      const $toggle = $('.toggle');
      $toggle.prop('checked',false);
      cancelButtons();
    })
  };

  const cancelButtons = function(){
    const $coaching = $('.coachingTab');
    $coaching.off('click');
    const $event = $('.eventTab');
    $event.off('click');
    const $facilitation = $('.facilitationTab');
    $facilitation.off('click');
    const $resource = $('.resourceTab');
    $resource.off('click');
    const $strategic = $('.strategicTab');
    $strategic.off('click');
  };

  const $homeButton = $('.homeTab');
  $homeButton.on('click',()=>{
    $other.css('display','none');
    $home.css('display','block');
  });

  const $aboutButton = $('.aboutTab');
  $aboutButton.on('click',()=>{
    $home.css('display','none');
    $other.css('display','none');
    $about.css('display','block');
  });

  const $contactButton = $('.contactTab');
  $contactButton.on('click',()=>{
    $home.css('display','none');
    $other.css('display','none');
    $contact.css('display','block');
  });

  const $serviceButton = $('.serviceTab');
  $serviceButton.on('click',()=>{
    setButtons();
  });

  const $EmailButton = $('#send_email');
  $EmailButton.on('click', ()=>{
    $other.css('display','none');
    $home.css('display','block');
  })

  var from, to, subject, message, text;
  $("#send_email").click(function(){
    from = $("#from").val();
    to = 'mollyvyoung@hotmail.com';
    subject = $("#subject").val();
    message = $('#text').val();
    text = "Message from: " + from + "\n\n" + message;
    $.get("https://easymailer.herokuapp.com/send", { to: to, subject: subject, text: text}, function(data){
      if (data == 'sent') {
        console.log('message sent');
        $('#from').val('');
        $('#subject').val('');
        $('#text').val('');
      } else {
        console.log(data);
        $('#from').val('');
        $('#subject').val('');
        $('#text').val('');
      }
    })
  });
})
