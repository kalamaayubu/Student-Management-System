const form = document.getElementById("studentForm");
const studentsList = document.getElementById("studentsList");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const grade = document.getElementById("grade").value;

    const response = await fetch('/addStudent', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({name, age, grade})
    });

    const message = await response.text();
    alert(message);
    if (response.ok) {
        getStudents(); //display list of students
        form.reset();
    } 
});

// Function that lists the students
async function getStudents() {
    studentsList.innerHTML = ''; // Overwrite anything that is in the studentList container
    const response = await fetch('/students');
    const students = await response.json();

    students.forEach(student => {
      const studentItem = document.createElement('div'); // Create a div for each student
      studentItem.innerHTML = `
        <p>Name: ${student.name}</p>
        <p>Age: ${student.age}</p>
        <p>Grade: ${student.grade}</p>
        <button onclick="editStudent(${student.id})">Edit</button>
        <button onclick="deleteStudent(${student.id}, event)">Delete</button>
      `;
      studentsList.appendChild(studentItem);
    });
}

// The edit student function
async function editStudent(id) {
    const newName = prompt('Enter new name: ');
    const newAge = prompt('Enter new age: ');
    const newGrade = prompt('Enter new grade ');

    // Send a PUT request to update a student record in the student table
    const response = await fetch(`/editStudent/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName, age: newAge, grade: newGrade })
    });

    // Display response message
    const message = await response.text();
    alert(message);

    // If the request was successful, refresh the student list
    if(response.ok) {
        await getStudents();
    }
}

// The delete student function
async function deleteStudent(id, event) {
    event.preventDefault();
    await fetch(`/deleteStudent/${id}`, {
        method: 'DELETE'
    });
    await getStudents(); // the await helps to wait untill the list of students is updated
}

getStudents();