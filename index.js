const submitData = async (event) => {
  event.preventDefault();  // ป้องกันการรีเฟรชหน้าตอนส่งฟอร์ม
  console.log("Form submitted");

  let firstname = document.querySelector("input[name=firstname]").value;
  let lastname = document.querySelector("input[name=lastname]").value;
  let age = document.querySelector("input[name=age]").value;
  let gender = document.querySelector("input[name=gender]:checked")?.value || "";
  let interests = Array.from(document.querySelectorAll("input[name=interest]:checked")).map(el => el.value);
  let description = document.querySelector("textarea[name=description]").value;
  let messageDOM = document.getElementById("message");

  console.log("Submitted data:", { firstname, lastname, age, gender, interests, description });

  let userData = { firstname, lastname, age, gender, interests, description };

  try {
      // ตรวจสอบข้อมูลก่อนส่ง
      const errors = validateData(userData);
      if (errors.length > 0) {
          throw { message: "กรุณากรอกข้อมูลให้ครบถ้วน", errors };
      }

      let response;
      if (mode === "CREATE") {
          console.log("Sending POST request to create new user");
          response = await axios.post(`${BASE_URL}/user`, userData);
      } else {
          console.log("Sending PUT request to update user");
          response = await axios.put(`${BASE_URL}/user/${selectedId}`, userData);
      }

      console.log("Response:", response.data);

      messageDOM.innerText = "บันทึกข้อมูลเรียบร้อย";
      messageDOM.className = "message success";
  } catch (error) {
      console.error("Error:", error);

      let errorMessage = error.message || "เกิดข้อผิดพลาด";
      let errorDetails = error.errors?.length ? error.errors : ["ไม่สามารถส่งข้อมูลได้"];

      if (error.response) {
          console.error("API error response:", error.response.data);
          errorMessage = `API Error: ${error.response.data.message || 'Unknown error'}`;
      }

      let htmlData = `<div><div>${errorMessage}</div><ul>`;
      errorDetails.forEach(err => {
          htmlData += `<li>${err}</li>`;
      });
      htmlData += "</ul></div>";

      messageDOM.innerHTML = htmlData;
      messageDOM.className = "message danger";
  }
};
