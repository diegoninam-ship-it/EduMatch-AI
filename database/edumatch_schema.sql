-- ============================================================
-- EduMatch AI - Esquema de Base de Datos Completo
-- Motor: MariaDB / MySQL
-- Generado: 2026-05-05
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ============================================================
-- LIMPIEZA (orden inverso a FKs)
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `log_ia`;
DROP TABLE IF EXISTS `notificaciones`;
DROP TABLE IF EXISTS `feedback_sesion`;
DROP TABLE IF EXISTS `pagos`;
DROP TABLE IF EXISTS `sesiones`;
DROP TABLE IF EXISTS `disponibilidad_tutor`;
DROP TABLE IF EXISTS `tutor_materia`;
DROP TABLE IF EXISTS `tutores`;
DROP TABLE IF EXISTS `progreso_tema`;
DROP TABLE IF EXISTS `ruta_detalle`;
DROP TABLE IF EXISTS `rutas_aprendizaje`;
DROP TABLE IF EXISTS `temas`;
DROP TABLE IF EXISTS `modulos`;
DROP TABLE IF EXISTS `materias`;
DROP TABLE IF EXISTS `perfil_estudiante`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. USUARIOS Y ROLES
-- ============================================================

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `uk_rol_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'ADMIN'),
(2, 'ESTUDIANTE'),
(3, 'TUTOR');

-- --------------------------------------------------------

CREATE TABLE `usuarios` (
  `id_usuario` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `id_rol` int(11) NOT NULL,
  `fecha_registro` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_usuarios_email` (`email`),
  KEY `fk_usuarios_rol` (`id_rol`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ============================================================
-- 2. PERFIL ESTUDIANTE
-- ============================================================

CREATE TABLE `perfil_estudiante` (
  `id_perfil` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `nivel` varchar(50) DEFAULT NULL,
  `objetivos` varchar(500) DEFAULT NULL,
  `horario_preferido` varchar(100) DEFAULT NULL,
  `horas_disponibles` varchar(50) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_perfil`),
  UNIQUE KEY `uk_perfil_usuario` (`id_usuario`),
  CONSTRAINT `fk_perfil_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ============================================================
-- 3. ESTRUCTURA ACADÉMICA (BASE PARA IA)
-- ============================================================

CREATE TABLE `materias` (
  `id_materia` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

CREATE TABLE `modulos` (
  `id_modulo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `orden` int(11) NOT NULL DEFAULT 1,
  `id_materia` int(11) NOT NULL,
  PRIMARY KEY (`id_modulo`),
  KEY `fk_modulo_materia` (`id_materia`),
  CONSTRAINT `fk_modulo_materia` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

CREATE TABLE `temas` (
  `id_tema` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `nivel_dificultad` enum('BASICO','INTERMEDIO','AVANZADO') NOT NULL DEFAULT 'BASICO',
  `orden` int(11) NOT NULL DEFAULT 1,
  `id_modulo` int(11) NOT NULL,
  PRIMARY KEY (`id_tema`),
  KEY `fk_tema_modulo` (`id_modulo`),
  CONSTRAINT `fk_tema_modulo` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ============================================================
-- 4. RUTA DE APRENDIZAJE (IA CORE)
-- ============================================================

CREATE TABLE `rutas_aprendizaje` (
  `id_ruta` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `estado` enum('ACTIVA','COMPLETADA','PAUSADA') NOT NULL DEFAULT 'ACTIVA',
  `fecha_creacion` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id_ruta`),
  KEY `fk_ruta_usuario` (`id_usuario`),
  CONSTRAINT `fk_ruta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `ruta_detalle` (
  `id_detalle` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_ruta` bigint(20) NOT NULL,
  `id_tema` int(11) NOT NULL,
  `orden` int(11) NOT NULL DEFAULT 1,
  `estado` enum('PENDIENTE','EN_PROGRESO','COMPLETADO') NOT NULL DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id_detalle`),
  KEY `fk_detalle_ruta` (`id_ruta`),
  KEY `fk_detalle_tema` (`id_tema`),
  CONSTRAINT `fk_detalle_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `rutas_aprendizaje` (`id_ruta`),
  CONSTRAINT `fk_detalle_tema` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id_tema`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `progreso_tema` (
  `id_progreso` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `id_tema` int(11) NOT NULL,
  `estado` enum('PENDIENTE','EN_PROGRESO','COMPLETADO') NOT NULL DEFAULT 'PENDIENTE',
  `porcentaje_avance` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_progreso`),
  UNIQUE KEY `uk_progreso_usuario_tema` (`id_usuario`, `id_tema`),
  KEY `fk_progreso_usuario` (`id_usuario`),
  KEY `fk_progreso_tema` (`id_tema`),
  CONSTRAINT `fk_progreso_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `fk_progreso_tema_ref` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id_tema`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 5. TUTORES Y DISPONIBILIDAD
-- ============================================================

CREATE TABLE `tutores` (
  `id_tutor` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `precio_sesion` double DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `biografia` varchar(500) DEFAULT NULL,
  `experiencia` varchar(255) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `rating_promedio` double NOT NULL DEFAULT 0,
  `total_sesiones` int(11) NOT NULL DEFAULT 0,
  `ubicacion` varchar(100) DEFAULT NULL,
  `verificado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_tutor`),
  UNIQUE KEY `uk_tutor_usuario` (`id_usuario`),
  CONSTRAINT `fk_tutor_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

CREATE TABLE `tutor_materia` (
  `id_tutor` bigint(20) NOT NULL,
  `id_materia` int(11) NOT NULL,
  PRIMARY KEY (`id_tutor`, `id_materia`),
  KEY `fk_tm_materia` (`id_materia`),
  CONSTRAINT `fk_tm_tutor` FOREIGN KEY (`id_tutor`) REFERENCES `tutores` (`id_tutor`),
  CONSTRAINT `fk_tm_materia` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

CREATE TABLE `disponibilidad_tutor` (
  `id_disponibilidad` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_tutor` bigint(20) NOT NULL,
  `dia_semana` varchar(20) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('DISPONIBLE','BLOQUEADO') NOT NULL DEFAULT 'DISPONIBLE',
  PRIMARY KEY (`id_disponibilidad`),
  KEY `fk_disp_tutor` (`id_tutor`),
  CONSTRAINT `fk_disp_tutor` FOREIGN KEY (`id_tutor`) REFERENCES `tutores` (`id_tutor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ============================================================
-- 6. SESIONES (SERVICIO)
-- ============================================================

CREATE TABLE `sesiones` (
  `id_sesion` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_estudiante` bigint(20) NOT NULL,
  `id_tutor` bigint(20) NOT NULL,
  `id_materia` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('PROGRAMADA','COMPLETADA','CANCELADA') NOT NULL DEFAULT 'PROGRAMADA',
  `enlace_reunion` varchar(255) DEFAULT NULL,
  `plataforma` varchar(100) DEFAULT NULL,
  `notas` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id_sesion`),
  KEY `fk_sesion_estudiante` (`id_estudiante`),
  KEY `fk_sesion_tutor` (`id_tutor`),
  KEY `fk_sesion_materia` (`id_materia`),
  CONSTRAINT `fk_sesion_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `fk_sesion_tutor` FOREIGN KEY (`id_tutor`) REFERENCES `tutores` (`id_tutor`),
  CONSTRAINT `fk_sesion_materia` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `pagos` (
  `id_pago` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_sesion` bigint(20) NOT NULL,
  `monto` double NOT NULL,
  `estado` enum('PENDIENTE','PAGADO','FALLIDO') NOT NULL DEFAULT 'PENDIENTE',
  `fecha_pago` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `fk_pago_sesion` (`id_sesion`),
  CONSTRAINT `fk_pago_sesion` FOREIGN KEY (`id_sesion`) REFERENCES `sesiones` (`id_sesion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `feedback_sesion` (
  `id_feedback` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_sesion` bigint(20) NOT NULL,
  `calificacion_cuantitativa` int(11) DEFAULT NULL COMMENT '1 a 5',
  `calificacion_cualitativa` varchar(50) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_registro` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id_feedback`),
  UNIQUE KEY `uk_feedback_sesion` (`id_sesion`),
  CONSTRAINT `fk_feedback_sesion` FOREIGN KEY (`id_sesion`) REFERENCES `sesiones` (`id_sesion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 7. SOPORTE
-- ============================================================

CREATE TABLE `notificaciones` (
  `id_notificacion` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensaje` varchar(500) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id_notificacion`),
  KEY `fk_notif_usuario` (`id_usuario`),
  CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 8. IA - LOG (OPCIONAL)
-- ============================================================

CREATE TABLE `log_ia` (
  `id_log` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `tipo_evento` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id_log`),
  KEY `fk_log_usuario` (`id_usuario`),
  CONSTRAINT `fk_log_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
