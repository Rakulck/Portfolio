import ProjectDetail from "./ProjectDetail";
import { allProjects, getProject } from "../../projectData";

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return (
      <main className="project-missing">
        <p>Project not found.</p>
        <a href="/#projects">Return to work</a>
      </main>
    );
  }

  return <ProjectDetail project={project} />;
}
