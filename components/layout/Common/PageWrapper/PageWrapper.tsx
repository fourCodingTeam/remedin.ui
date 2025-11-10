import {
  ContentWrapper,
  PageWrapperWrapper,
  ScrollableWrapper,
} from "./PageWrapper.styles";
import type { PageWrapperProps } from "./PageWrapper.types";

export function PageWrapper({
  children,
  header,
  isScrollable,
}: PageWrapperProps) {
  return (
    <PageWrapperWrapper>
      {header}
      {isScrollable ? (
        <ScrollableWrapper>{children}</ScrollableWrapper>
      ) : (
        <ContentWrapper>{children}</ContentWrapper>
      )}
    </PageWrapperWrapper>
  );
}
