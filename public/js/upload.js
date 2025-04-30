document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const formData = new FormData(this);
    const xhr = new XMLHttpRequest();
  
    xhr.upload.addEventListener('progress', function(e) {
      const percent = (e.loaded / e.total) * 100;
      document.getElementById('progressBar').style.width = percent + '%';
    });
  
    xhr.open('POST', '/files/upload');
    xhr.onload = function() {
      if (xhr.status === 200) {
        location.reload();
      }
    };
    xhr.send(formData);
  });
  