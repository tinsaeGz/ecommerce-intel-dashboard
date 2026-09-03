import { useEffect } from "react";

export function useDocumentMetadata(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    let descriptionElement = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!descriptionElement) {
      descriptionElement = document.createElement("meta");
      descriptionElement.name = "description";
      document.head.append(descriptionElement);
    }
    descriptionElement.content = description;
  }, [description, title]);
}
