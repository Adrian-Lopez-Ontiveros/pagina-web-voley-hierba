document.addEventListener('DOMContentLoaded', function() {
    // --- Datos de las Categorías y sus Grupos ---
    const tournamentCategories = {
        'senior': {
            name: 'Senior 3x3 Mixto',
            numGroups: 8,
            teamsPerGroup: 6,
            pointsPerWin: 2, // Ejemplo de puntos por victoria
            rankingColors: true // Para aplicar los colores de medalla
        },
        'juvenil': {
            name: 'Juvenil 3x3 Mixto',
            numGroups: 4,
            teamsPerGroup: 6,
            pointsPerWin: 2,
            rankingColors: false
        },
        'cadete': {
            name: 'Cadete 4x4 Mixto',
            numGroups: 2,
            teamsPerGroup: 8,
            pointsPerWin: 2,
            rankingColors: false
        },
        'infantil': {
            name: 'Infantil 4x4 Mixto',
            numGroups: 2,
            teamsPerGroup: 8,
            pointsPerWin: 2,
            rankingColors: false
        }
    };

    // --- Función para Generar Enfrentamientos de Round Robin ---
    function generateRoundRobinSchedule(teamsArray) {
        if (teamsArray.length < 2) return [];

        let teams = [...teamsArray]; // Copia el array para no modificar el original
        const schedule = [];

        const isOdd = teams.length % 2 !== 0;
        if (isOdd) {
            teams.push({ name: 'BYE', id: 'BYE' });
        }

        const n = teams.length;
        const totalRounds = n - 1;

        for (let round = 0; round < totalRounds; round++) {
            const currentRoundMatches = [];
            for (let i = 0; i < n / 2; i++) {
                const team1 = teams[i];
                const team2 = teams[n - 1 - i];

                if (team1.id !== 'BYE' && team2.id !== 'BYE') {
                    currentRoundMatches.push({ team1: team1.name, team2: team2.name, score1: 0, score2: 0 }); // Añadir scores
                } else if (team1.id === 'BYE') {
                    currentRoundMatches.push({ team1: team2.name, team2: 'descansa' });
                } else if (team2.id === 'BYE') {
                    currentRoundMatches.push({ team1: team1.name, team2: 'descansa' });
                }
            }
            schedule.push(currentRoundMatches);

            const pivot = teams[0];
            const rotatedPart = teams.slice(1, n - 1);
            const lastTeam = teams[n - 1];

            teams.splice(0, n);
            teams.push(pivot);
            teams.push(lastTeam);
            teams.push(...rotatedPart);
        }
        return schedule;
    }

    // --- Función para Generar Clasificación Inicial ---
    function generateInitialClassification(teamsArray) {
        return teamsArray.map(teamName => ({
            name: teamName,
            Puntos: 0,
            PJ: 0,
            PG: 0,
            PP: 0,
            PF: 0, // Puntos a Favor
            PC: 0, // Puntos en Contra
            Dif: 0  // Diferencia de Puntos
        }));
    }


    // Elementos del DOM
    const selectCategoryDropdown = document.getElementById('selectCategory');
    const resultsDisplayArea = document.getElementById('results-display-area');
    const groupDetailArea = document.getElementById('group-detail-area'); // Nuevo contenedor principal
    const backToGroupsBtn = document.getElementById('backToGroups');
    const currentGroupTitle = document.getElementById('current-group-title');
    const classificationArea = document.getElementById('classification-area');
    const scheduleListContainer = document.getElementById('schedule-list-container');

    let currentCategoryKey = ''; // Para guardar la categoría seleccionada

    // --- Función para Mostrar Grupos de una Categoría ---
    function showCategoryGroups(categoryKey) {
        currentCategoryKey = categoryKey; // Guardar la categoría actual

        resultsDisplayArea.innerHTML = '';
        groupDetailArea.style.display = 'none'; // Ocultar el área de detalle de grupo

        if (!categoryKey) {
            resultsDisplayArea.innerHTML = '<p class="placeholder-text">Selecciona una categoría en el menú superior para ver sus detalles.</p>';
            resultsDisplayArea.style.display = 'flex';
            return;
        }

        resultsDisplayArea.style.display = 'block';

        const categoryData = tournamentCategories[categoryKey];
        if (!categoryData) {
            resultsDisplayArea.innerHTML = '<p class="placeholder-text">Categoría no encontrada.</p>';
            resultsDisplayArea.style.display = 'flex';
            return;
        }

        const categoryTitle = document.createElement('h4');
        categoryTitle.textContent = categoryData.name;
        resultsDisplayArea.appendChild(categoryTitle);

        const groupDescription = document.createElement('p');
        groupDescription.textContent = `Selecciona un grupo para ver su clasificación y jornadas (${categoryData.numGroups} grupos de ${categoryData.teamsPerGroup} equipos).`;
        resultsDisplayArea.appendChild(groupDescription);

        const groupContainerDiv = document.createElement('div');
        groupContainerDiv.className = 'group-container';

        for (let i = 1; i <= categoryData.numGroups; i++) {
            const groupCard = document.createElement('div');
            groupCard.className = 'group-card';
            const groupName = String.fromCharCode(64 + i); // A, B, C...

            // Generar equipos para este grupo específico
            const teamsInGroup = Array.from({ length: categoryData.teamsPerGroup },
                (_, teamIdx) => `Equipo ${groupName}${teamIdx + 1}`
            );

            groupCard.innerHTML = `<h5>Grupo ${groupName}</h5>`;
            groupCard.dataset.category = categoryKey;
            groupCard.dataset.groupIndex = i;
            groupCard.dataset.teams = JSON.stringify(teamsInGroup); // Guardar los nombres de los equipos

            groupCard.addEventListener('click', function() {
                const selectedCat = this.dataset.category;
                const selectedGroupIdx = parseInt(this.dataset.groupIndex);
                const teamsData = JSON.parse(this.dataset.teams); // Parsear los nombres de los equipos

                showGroupDetails(selectedCat, selectedGroupIdx, teamsData);
            });

            groupContainerDiv.appendChild(groupCard);
        }
        resultsDisplayArea.appendChild(groupContainerDiv);
    }

    // --- Función para Mostrar Detalles (Clasificación y Jornadas) de un Grupo ---
    function showGroupDetails(categoryKey, groupIndex, teamsInGroup) {
        resultsDisplayArea.style.display = 'none'; // Ocultar la lista de grupos
        groupDetailArea.style.display = 'block'; // Mostrar el área de detalle de grupo

        const categoryData = tournamentCategories[categoryKey];
        const groupName = String.fromCharCode(64 + groupIndex);

        currentGroupTitle.textContent = `${categoryData.name} - Grupo ${groupName}`;

        // Limpiar áreas
        classificationArea.innerHTML = '';
        scheduleListContainer.innerHTML = '';

        // 1. Mostrar Clasificación
        renderClassificationTable(teamsInGroup, categoryKey);

        // 2. Mostrar Jornadas
        renderSchedule(teamsInGroup);

        // Asegurarse de que el contenedor de jornadas tenga el estilo de cuadrícula
        scheduleListContainer.classList.add('schedule-list-container');
    }


    // --- Función para Renderizar la Tabla de Clasificación ---
    function renderClassificationTable(teamsArray, categoryKey) {
        const classificationData = generateInitialClassification(teamsArray); // Usa los nombres de equipos reales
        const categoryData = tournamentCategories[categoryKey];

        const table = document.createElement('table');
        table.className = 'classification-table';

        // Encabezado de la tabla
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Pos</th>
                <th>Equipo</th>
                <th>Puntos</th>
                <th>PJ</th>
                <th>PG</th>
                <th>PP</th>
                <th>PF</th>
                <th>PC</th>
                <th>Dif</th>
            </tr>
        `;
        table.appendChild(thead);

        // Cuerpo de la tabla
        const tbody = document.createElement('tbody');
        classificationData.forEach((team, index) => {
            const row = document.createElement('tr');

            let posClass = '';
            if (categoryData.rankingColors) {
                if (index === 0 || index === 1) {
                    posClass = 'pos-gold';
                } else if (index === 2 || index === 3) {
                    posClass = 'pos-silver';
                } else if (index === 4 || index === 5) {
                    posClass = 'pos-bronze';
                }
            }

            row.innerHTML = `
                <td class="${posClass}">${index + 1}</td>
                <td class="team-name">${team.name}</td>
                <td>${team.Puntos}</td>
                <td>${team.PJ}</td>
                <td>${team.PG}</td>
                <td>${team.PP}</td>
                <td>${team.PF}</td>
                <td>${team.PC}</td>
                <td>${team.Dif}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        classificationArea.innerHTML = '';
        const classificationTitle = document.createElement('h4');
        classificationTitle.textContent = 'Clasificación';
        classificationArea.appendChild(classificationTitle);
        classificationArea.appendChild(table);
    }


    // --- Función para Renderizar las Jornadas ---
    function renderSchedule(teamsArray) {
        const schedule = generateRoundRobinSchedule(teamsArray.map(name => ({ name: name, id: name }))); // Necesita objetos para el algoritmo
        scheduleListContainer.innerHTML = '';

        const scheduleTitle = document.createElement('h4');
        scheduleTitle.textContent = 'Jornadas';
        scheduleListContainer.appendChild(scheduleTitle);

        schedule.forEach((roundMatches, roundIndex) => {
            const roundCard = document.createElement('div');
            roundCard.className = 'schedule-round-card';
            roundCard.innerHTML = `<h6>Jornada ${roundIndex + 1}</h6>`;

            roundMatches.forEach(match => {
                const matchItem = document.createElement('div');
                matchItem.className = 'match-item';

                if (match.team2 === 'descansa') {
                    matchItem.innerHTML = `
                        <span class="match-teams">${match.team1}</span>
                        <span class="match-score">descansa</span>
                    `;
                } else {
                    matchItem.innerHTML = `
                        <span class="match-teams">${match.team1} vs ${match.team2}</span>
                        <span class="match-score">${match.score1}-${match.score2}</span>
                    `;
                }
                roundCard.appendChild(matchItem);
            });
            scheduleListContainer.appendChild(roundCard);
        });
    }


    // --- Event Listeners ---
    if (selectCategoryDropdown) {
        selectCategoryDropdown.addEventListener('change', function() {
            const selectedCategory = this.value;
            showCategoryGroups(selectedCategory);
        });
        showCategoryGroups(selectCategoryDropdown.value); // Mostrar el placeholder al inicio
    }

    if (backToGroupsBtn) {
        backToGroupsBtn.addEventListener('click', function() {
            showCategoryGroups(currentCategoryKey); // Volver a mostrar los grupos de la categoría actual
        });
    }
});
