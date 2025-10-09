import React from "react";

export default function AboutMe() {
  return (
    <div className="mx-auto max-w-4xl p-6 space-y-10">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">About Me</h1>
        <p className="text-gray-700">
          I’m a full-stack developer (Gongfan Zhang) who loves learning by building. This
          project grows from my prior industry experience and focuses on{" "}
          <strong>NZ medicinal plants and animal-based products</strong>,
          implemented as a <strong>decoupled web app</strong> from front end to
          back end.
        </p>

        <h2 className="text-xl font-semibold">Project Overview</h2>
        <p className="text-gray-700">
          The app offers product showcasing, a supplier panel, and basic
          management features. It emphasizes clean IA and friendly UX while
          leaving room for future extensions (multi-language, maps, inventory &
          orders).
        </p>

        <h2 className="text-xl font-semibold">Tech Stack</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            <strong>Frontend</strong>: React + Vite + i18next (route-level i18n,
            componentization, performance)
          </li>
          <li>
            <strong>Backend</strong>: Node.js + Express + Sequelize (REST APIs,
            auth, relations)
          </li>
          <li>
            <strong>Database</strong>: MySQL (structured schema, constraints,
            indexes)
          </li>
          <li>
            <strong>Extras</strong>: Tailwind CSS, Axios
          </li>
        </ul>

        <h2 className="text-xl font-semibold">My Contributions</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            Designed data models and API contracts for users/suppliers/products
          </li>
          <li>
            Implemented token-based auth with role control (admin/supplier)
          </li>
          <li>
            Integrated i18n with routing and state management for
            maintainability
          </li>
          <li>Prepared extension points for uploads, geolocation, payments</li>
        </ul>

        <h2 className="text-xl font-semibold">Goal</h2>
        <p className="text-gray-700">
          Turn <strong>real business understanding</strong> into{" "}
          <strong>engineered, iterative</strong> product value—while sharpening
          full-stack skills in architecture, code quality, and observability.
        </p>
      </section>
    </div>
  );
}
