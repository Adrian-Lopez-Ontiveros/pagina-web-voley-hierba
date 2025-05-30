document.addEventListener('DOMContentLoaded', function() {
    const categoriasTorneo = {
        'senior': {
            nombre: 'Senior 3x3 Mixto',
            numGrupos: 8,
            equiposPorGrupo: 6
        },
        'juvenil': {
            nombre: 'Juvenil 3x3 Mixto',
            numGrupos: 4,
            equiposPorGrupo: 6
        },
        'cadete': {
            nombre: 'Cadete 4x4 Mixto',
            numGrupos: 2,
            equiposPorGrupo: 8
        },
        'infantil': {
            nombre: 'Infantil 4x4 Mixto',
            numGrupos: 2,
            equiposPorGrupo: 8
        }
    };

    function generarCalendarioRoundRobin(numEquipos) {
        if (numEquipos < 2) return [];

        const equipos = Array.from({ length: numEquipos }, (_, i) => `Equipo ${i + 1}`);
        const calendario = [];

        const esImpar = numEquipos % 2 !== 0;
        if (esImpar) {
            equipos.push('BYE');
        }

        const numRondas = equipos.length - 1;
        const numPartidosPorRonda = equipos.length / 2;

        for (let ronda = 0; ronda < numRondas; ronda++) {
            const partidosRondaActual = [];
            for (let i = 0; i < numPartidosPorRonda; i++) {
                const equipo1 = equipos[i];
                const equipo2 = equipos[equipos.length - 1 - i];

                if (equipo1 !== 'BYE' && equipo2 !== 'BYE') {
                    partidosRondaActual.push(`${equipo1} vs ${equipo2}`);
                }
            }
            calendario.push(partidosRondaActual);

            const ultimoEquipo = equipos.pop();
            equipos.splice(1, 0, ultimoEquipo);
        }
        return calendario;
    }

    function generarClasificacionAleatoria(numEquipos) {
        const equipos = Array.from({ length: numEquipos }, (_, i) => `Equipo ${i + 1}`);
        const clasificacion = equipos.map(equipo => {
            const PJ = 0;
            const PG = 0;
            const PP = 0;
            const SF = 0;
            const SC = 0;
            const Ptos = 0;

            return { nombre: equipo, PJ, PG, PP, SF, SC, Ptos };
        });

        clasificacion.sort((a, b) => {
            return a.nombre.localeCompare(b.nombre);
        });

        return clasificacion;
    }

    function renderizarTablaClasificacion(datosClasificacion, idCategoria) {
        const tabla = document.createElement('table');
        tabla.className = 'tabla-clasificacion';

        const thead = tabla.createTHead();
        const filaCabecera = thead.insertRow();
        const cabeceras = ['Pos.', 'Equipo', 'PJ', 'PG', 'PP', 'SF', 'SC', 'Ptos'];
        cabeceras.forEach(texto => {
            const th = document.createElement('th');
            th.textContent = texto;
            filaCabecera.appendChild(th);
        });

        const tbody = tabla.createTBody();
        datosClasificacion.forEach((equipo, indice) => {
            const fila = tbody.insertRow();
            const posicion = indice + 1;

            let clasePosicion = '';
            if (idCategoria === 'senior') {
                if (posicion === 1 || posicion === 2) {
                    clasePosicion = 'pos-oro';
                } else if (posicion === 3 || posicion === 4) {
                    clasePosicion = 'pos-plata';
                } else if (posicion === 5 || posicion === 6) {
                    clasePosicion = 'pos-bronce';
                }
            } else { 
                if (posicion <= 2) {
                    clasePosicion = 'pos-oro';
                } else {
                    clasePosicion = 'pos-rojo';
                }
            }

            const celdaPosicion = fila.insertCell();
            celdaPosicion.textContent = posicion;
            if (clasePosicion) {
                celdaPosicion.classList.add(clasePosicion);
            }

            const celdaNombreEquipo = fila.insertCell();
            celdaNombreEquipo.textContent = equipo.nombre;
            celdaNombreEquipo.classList.add('nombre-equipo');

            fila.insertCell().textContent = equipo.PJ;
            fila.insertCell().textContent = equipo.PG;
            fila.insertCell().textContent = equipo.PP;
            fila.insertCell().textContent = equipo.SF;
            fila.insertCell().textContent = equipo.SC;
            fila.insertCell().textContent = equipo.Ptos;
        });

        return tabla;
    }

    function renderizarGrupos(categoria, numGrupos, equiposPorGrupo) {
        const grupos = [];
        for (let i = 1; i <= numGrupos; i++) {
            grupos.push({
                nombre: `Grupo ${String.fromCharCode(64 + i)}`,
                clasificacion: generarClasificacionAleatoria(equiposPorGrupo), // Aquí se usan los valores iniciales a 0
                calendario: generarCalendarioRoundRobin(equiposPorGrupo)
            });
        }
        return grupos;
    }

    const areaMostrarResultados = document.getElementById('areaMostrarResultados');
    const areaDetalleGrupo = document.getElementById('areaDetalleGrupo');
    const volverAGruposBtn = document.getElementById('volverAGruposBtn');
    const contenedorBotonVolver = document.getElementById('contenedorBotonVolver');
    const areaClasificacion = document.getElementById('areaClasificacion');
    const contenedorListaCalendario = document.getElementById('contenedorListaCalendario');

    if (volverAGruposBtn) {
        volverAGruposBtn.addEventListener('click', () => {
            const seleccionarCategoriaDropdown = document.getElementById('seleccionarCategoria');
            const categoriaActual = seleccionarCategoriaDropdown ? seleccionarCategoriaDropdown.value : '';
            renderizarResultadosCategoria(categoriaActual);
        });
    }


    function renderizarResultadosCategoria(idCategoria) {
        areaDetalleGrupo.style.display = 'none';
        if (contenedorBotonVolver) {
            contenedorBotonVolver.style.display = 'none';
        }

        areaMostrarResultados.style.display = 'block';
        areaMostrarResultados.innerHTML = '';

        const textoPlaceholder = document.createElement('p');
        textoPlaceholder.className = 'texto-placeholder';

        if (!idCategoria) {
            textoPlaceholder.textContent = 'Selecciona una categoría en el menú superior para ver sus detalles.';
            areaMostrarResultados.appendChild(textoPlaceholder);
            return;
        }

        const infoCategoria = categoriasTorneo[idCategoria];
        if (!infoCategoria) {
            textoPlaceholder.textContent = 'Categoría no encontrada.';
            areaMostrarResultados.appendChild(textoPlaceholder);
            return;
        }

        areaMostrarResultados.appendChild(document.createElement('h4')).textContent = `Grupos de ${infoCategoria.nombre}`;
        const grupos = renderizarGrupos(idCategoria, infoCategoria.numGrupos, infoCategoria.equiposPorGrupo);

        const divContenedorGrupo = document.createElement('div');
        divContenedorGrupo.className = 'contenedor-grupo';

        grupos.forEach(grupo => {
            const tarjetaGrupo = document.createElement('div');
            tarjetaGrupo.className = 'tarjeta-grupo';
            tarjetaGrupo.innerHTML = `<h5>${grupo.nombre}</h5>`;
            tarjetaGrupo.dataset.nombreGrupo = grupo.nombre;
            tarjetaGrupo.dataset.idCategoria = idCategoria;

            tarjetaGrupo.addEventListener('click', function() {
                mostrarDetallesGrupo(grupo, idCategoria);
            });
            divContenedorGrupo.appendChild(tarjetaGrupo);
        });

        areaMostrarResultados.appendChild(divContenedorGrupo);
    }


    function mostrarDetallesGrupo(datosGrupo, idCategoria) {
        areaMostrarResultados.style.display = 'none';

        areaDetalleGrupo.style.display = 'block';
        if (contenedorBotonVolver) {
            contenedorBotonVolver.style.display = 'block';
        }

        document.getElementById('tituloGrupoActual').textContent = `Detalles de ${datosGrupo.nombre} - ${categoriasTorneo[idCategoria].nombre}`;

        areaClasificacion.innerHTML = '';
        areaClasificacion.appendChild(renderizarTablaClasificacion(datosGrupo.clasificacion, idCategoria));

        contenedorListaCalendario.innerHTML = '';
        datosGrupo.calendario.forEach((partidosRonda, indiceRonda) => {
            const tarjetaRonda = document.createElement('div');
            tarjetaRonda.className = 'tarjeta-ronda-calendario';
            tarjetaRonda.innerHTML = `<h6>Jornada ${indiceRonda + 1}</h6>`;
            partidosRonda.forEach(partido => {
                if (partido) {
                    const partes = partido.split(' vs ');
                    const equipo1 = partes[0];
                    const equipo2 = partes[1];
                    tarjetaRonda.innerHTML += `<div class="item-partido"><span class="equipos-partido">${equipo1} vs ${equipo2}</span> <span class="marcador-partido">0 - 0</span></div>`;
                }
            });
            contenedorListaCalendario.appendChild(tarjetaRonda);
        });
    }

    const seleccionarCategoriaDropdown = document.getElementById('seleccionarCategoria');
    if (seleccionarCategoriaDropdown) {
        seleccionarCategoriaDropdown.addEventListener('change', function() {
            const categoriaSeleccionada = this.value;
            renderizarResultadosCategoria(categoriaSeleccionada);
        });

        renderizarResultadosCategoria('');
    }
});