$(()=>{

  const $hamburger = $('#hamburger');

  const $hamburgerToggler = $('.hamburgerToggler');
  $hamburgerToggler.on('click',()=>{
    $hamburger.click();
  });

})
