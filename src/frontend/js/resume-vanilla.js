document.addEventListener("DOMContentLoaded", () => {
    const resumeContent = document.getElementById("resume-content");

    fetch('/api/resume')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Resume Data:", data);
            renderResume(data, resumeContent);
        })
        .catch(error => {
            console.error("Error fetching resume data:", error);
            resumeContent.innerHTML = "<p>Failed to load resume. Please try again later.</p>";
        });
});

function renderResume(data, container) {
    const { name, skills, experience } = data;

    container.innerHTML = `
        <h3>${name}</h3>
        <h4>Skills</h4>
        <ul>${skills.map(skill => `<li>${skill}</li>`).join('')}</ul>
        <h4>Experience</h4>
        <ul>
            ${experience.map(exp => `
                <li>
                    <strong>${exp.role}</strong> at ${exp.company} (${exp.duration})
                </li>
            `).join('')}
        </ul>
    `;
}