document.addEventListener('DOMContentLoaded', function() {
    // --- Datos de las Categorías y sus Grupos ---
    const tournamentCategories = {
        'senior': {
            name: 'Senior 3x3 Mixto',
            numGroups: 8,
            teamsPerGroup: 6
        },
        'juvenil': {
            name: 'Juvenil 3x3 Mixto',
            numGroups: 4,
            teamsPerGroup: 6
        },
        'cadete': {
            name: 'Cadete 4x4 Mixto',
            numGroups: 2,
            teamsPerGroup: 8
        },
        'infantil': {
            name: 'Infantil 4x4 Mixto',
            numGroups: 2,
            teamsPerGroup: 8
        }
    };

    // --- Función para Generar Enfrentamientos de Round Robin (Igual que antes) ---
    function generateRoundRobinSchedule(numTeams) {
        if (numTeams < 2) return [];

        const teams = Array.from({ length: numTeams }, (_, i) => `Equipo ${i + 1}`);
        const schedule = [];

        const isOdd = numTeams % 2 !== 0;
        if (isOdd) {
            teams.push('BYE');
        }

        const numRounds = teams.length - 1;
        const numMatchesPerRound = teams.length / 2;

        for (let round = 0; round < numRounds; round++) {
            const currentRoundMatches = [];
            for (let i = 0; i < numMatchesPerRound; i++) {
                const team1 = teams[i];
                const team2 = teams[teams.length - 1 - i];

                if (team1 !== 'BYE' && team2 !== 'BYE') {
                    currentRoundMatches.push(`${team1} vs ${team2}`);
                }
            }
            schedule.push(currentRoundMatches);

            const lastTeam = teams.pop();
            teams.splice(1, 0, lastTeam);
        }
        return schedule;
    }

    // --- Función para Generar Datos de Clasificación Aleatorios (para ejemplo) ---
    // MODIFICADA para que los valores iniciales sean 0
    function generateRandomClassification(numTeams) {
        const teams = Array.from({ length: numTeams }, (_, i) => `Equipo ${i + 1}`);
        const classification = teams.map(team => {
            // Todos los valores iniciales a 0
            const PJ = 0;
            const PG = 0;
            const PP = 0;
            const SF = 0;
            const SC = 0;
            const Ptos = 0;

            return { name: team, PJ, PG, PP, SF, SC, Ptos };
        });

        // La ordenación seguirá funcionando una vez que se introduzcan datos reales
        // Por ahora, todos tendrán 0 puntos, así que el orden será por nombre de equipo si quieres
        // o se mantendrá el orden de creación. Si quieres un orden específico para 0 puntos, dilo.
        classification.sort((a, b) => {
            // Si todos los puntos son 0, se ordenarán alfabéticamente por nombre de equipo
            return a.name.localeCompare(b.name);
        });

        return classification;
    }


    // --- Función para Renderizar la Tabla de Clasificación ---
    function renderClassificationTable(classificationData, categoryId) {
        const table = document.createElement('table');
        table.className = 'classification-table';

        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        const headers = ['Pos.', 'Equipo', 'PJ', 'PG', 'PP', 'SF', 'SC', 'Ptos'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        classificationData.forEach((team, index) => {
            const row = tbody.insertRow();
            const position = index + 1;

            let posClass = '';
            if (categoryId === 'senior') {
                if (position === 1 || position === 2) {
                    posClass = 'pos-gold';
                } else if (position === 3 || position === 4) {
                    posClass = 'pos-silver';
                } else if (position === 5 || position === 6) {
                    posClass = 'pos-bronze';
                }
            } else { // Juvenil, Cadete, Infantil
                if (position <= 2) {
                    posClass = 'pos-gold';
                } else {
                    posClass = 'pos-red';
                }
            }

            const posCell = row.insertCell();
            posCell.textContent = position;
            if (posClass) {
                posCell.classList.add(posClass);
            }

            const teamNameCell = row.insertCell();
            teamNameCell.textContent = team.name;
            teamNameCell.classList.add('team-name');

            row.insertCell().textContent = team.PJ;
            row.insertCell().textContent = team.PG;
            row.insertCell().textContent = team.PP;
            row.insertCell().textContent = team.SF;
            row.insertCell().textContent = team.SC;
            row.insertCell().textContent = team.Ptos;
        });

        return table;
    }

    // --- Función para Renderizar los Grupos y su Contenido ---
    function renderGroups(category, numGroups, teamsPerGroup) {
        const groups = [];
        for (let i = 1; i <= numGroups; i++) {
            groups.push({
                name: `Grupo ${String.fromCharCode(64 + i)}`,
                classification: generateRandomClassification(teamsPerGroup), // Aquí se usan los valores iniciales a 0
                schedule: generateRoundRobinSchedule(teamsPerGroup)
            });
        }
        return groups;
    }


    // --- Elementos del DOM ---
    const resultsDisplayArea = document.getElementById('results-display-area');
    const groupDetailArea = document.getElementById('group-detail-area');
    const backToGroupsBtn = document.getElementById('backToGroupsBtn');
    const backButtonContainer = document.getElementById('back-button-container');
    const classificationArea = document.getElementById('classification-area');
    const scheduleListContainer = document.getElementById('schedule-list-container');


    // Listener para el botón "Volver a Grupos"
    if (backToGroupsBtn) {
        backToGroupsBtn.addEventListener('click', () => {
            const selectCategoryDropdown = document.getElementById('selectCategory');
            const currentCategory = selectCategoryDropdown ? selectCategoryDropdown.value : '';
            renderCategoryResults(currentCategory);
        });
    }


    function renderCategoryResults(categoryId) {
        groupDetailArea.style.display = 'none';
        if (backButtonContainer) {
            backButtonContainer.style.display = 'none';
        }

        resultsDisplayArea.style.display = 'block';
        resultsDisplayArea.innerHTML = '';

        const placeholderText = document.createElement('p');
        placeholderText.className = 'placeholder-text';

        if (!categoryId) {
            placeholderText.textContent = 'Selecciona una categoría en el menú superior para ver sus detalles.';
            resultsDisplayArea.appendChild(placeholderText);
            return;
        }

        const categoryInfo = tournamentCategories[categoryId];
        if (!categoryInfo) {
            placeholderText.textContent = 'Categoría no encontrada.';
            resultsDisplayArea.appendChild(placeholderText);
            return;
        }

        resultsDisplayArea.appendChild(document.createElement('h4')).textContent = `Grupos de ${categoryInfo.name}`;
        const groups = renderGroups(categoryId, categoryInfo.numGroups, categoryInfo.teamsPerGroup);

        const groupContainerDiv = document.createElement('div');
        groupContainerDiv.className = 'group-container';

        groups.forEach(group => {
            const groupCard = document.createElement('div');
            groupCard.className = 'group-card';
            groupCard.innerHTML = `<h5>${group.name}</h5>`;
            groupCard.dataset.groupName = group.name;
            groupCard.dataset.categoryId = categoryId;

            groupCard.addEventListener('click', function() {
                displayGroupDetails(group, categoryId);
            });
            groupContainerDiv.appendChild(groupCard);
        });

        resultsDisplayArea.appendChild(groupContainerDiv);
    }


    function displayGroupDetails(groupData, categoryId) {
        resultsDisplayArea.style.display = 'none';

        groupDetailArea.style.display = 'block';
        if (backButtonContainer) {
            backButtonContainer.style.display = 'block';
        }

        document.getElementById('current-group-title').textContent = `Detalles de ${groupData.name} - ${tournamentCategories[categoryId].name}`;

        // Clasificación
        classificationArea.innerHTML = '';
        classificationArea.appendChild(renderClassificationTable(groupData.classification, categoryId));

        // Calendario / Jornadas
        scheduleListContainer.innerHTML = '';
        groupData.schedule.forEach((roundMatches, roundIndex) => {
            const roundCard = document.createElement('div');
            roundCard.className = 'schedule-round-card';
            roundCard.innerHTML = `<h6>Jornada ${roundIndex + 1}</h6>`;
            roundMatches.forEach(match => {
                if (match) {
                    const parts = match.split(' vs ');
                    const team1 = parts[0];
                    const team2 = parts[1];
                    roundCard.innerHTML += `<div class="match-item"><span class="match-teams">${team1} vs ${team2}</span> <span class="match-score">0 - 0</span></div>`;
                }
            });
            scheduleListContainer.appendChild(roundCard);
        });
    }

    // --- Lógica del Selector de Categorías ---
    const selectCategoryDropdown = document.getElementById('selectCategory');
    if (selectCategoryDropdown) {
        selectCategoryDropdown.addEventListener('change', function() {
            const selectedCategory = this.value;
            renderCategoryResults(selectedCategory);
        });

        renderCategoryResults('');
    }
});