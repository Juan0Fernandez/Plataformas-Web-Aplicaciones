// Tipo de proyecto
export enum ProjectType {
  ACADEMIC = 'academic',    // Proyectos académicos
  PROFESSIONAL = 'professional'  // Proyectos laborales/profesionales
}

// Tipo de participación en el proyecto
export enum ParticipationType {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  FULLSTACK = 'fullstack',
  DEVOPS = 'devops',
  DESIGN = 'design'
}

// Interfaz para un proyecto
export interface Project {
  id?: string;
  name: string;
  description: string;
  type: ProjectType;  // Académico o Profesional
  participationType: ParticipationType[];  // Frontend, Backend, etc.
  technologies: string[];  // Tecnologías utilizadas
  repositoryUrl?: string;  // Enlace al repositorio (GitHub, GitLab, etc.)
  demoUrl?: string;  // Enlace al despliegue (Firebase, Vercel, etc.)
  imageUrl?: string;  // Imagen del proyecto
  createdAt?: Date;
  updatedAt?: Date;
  programmerId: string;  // UID del programador dueño del proyecto
}

// Interfaz para los datos del programador
export interface ProgrammerProfile {
  uid: string;
  name: string;
  email: string;
  specialty: string;  // Especialidad (Frontend, Backend, Fullstack, etc.)
  description: string;  // Breve descripción
  photoURL?: string;
  // Enlaces de contacto y redes sociales
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  phone?: string;
  // Proyectos del programador
  projects?: Project[];
  createdAt?: Date;
  updatedAt?: Date;
}
