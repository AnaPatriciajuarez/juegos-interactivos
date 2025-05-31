# Sitio Web de Juegos Interactivos


## 🔄 Flujo de Trabajo (Feature Branch Workflow)
Este proyecto utiliza el modelo Feature Branch Workflow, ideal para el desarrollo organizado de nuevas funcionalidades. El flujo funciona de la siguiente manera:

--- 

1. La rama `main` contiene el código estable y listo para producción.
2. La rama `develop` agrupa el trabajo en progreso y los desarrollos aún en pruebas.
3. Por cada nueva funcionalidad, se crea una rama `feature/nombre-del-juego`.
4. Una vez completada y probada, la rama feature se fusiona (`merge`) a `develop`.
5. Cuando `develop` tiene cambios estables, se hace `merge` a `main`.



