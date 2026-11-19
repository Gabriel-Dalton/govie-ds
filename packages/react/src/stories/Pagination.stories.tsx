import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import Pagination from '@/pagination/Pagination';
import PaginationButton from '@/pagination/PaginationButton';
import PaginationEllipsis from '@/pagination/PaginationEllipsis';
import PaginationLink from '@/pagination/PaginationLink';
import { getPaginationList } from '@/atoms/pagination/utils';
import * as stories from '@/atoms/storybook/Pagination.meta';
import { useState } from 'react';
import ArrowBackward from '@/atoms/icons/ArrowBackward';
import ArrowForward from '@/atoms/icons/ArrowForward';
import { extractRenderBody } from '@/test-utilities';
import { importNext } from './helpers';
import Stack from '@/atoms/Stack';

const meta = {
  ...stories.meta,
  tags: ['next'],
  title: 'Navigation/Pagination/Pagination (Next)',
  component: Pagination,
  argTypes: {
    children: {
      control: false,
      description: 'The `PaginationLink`, `PaginationButton` and `PaginationEllipsis` items.',
      table: { type: { summary: 'ReactNode' } },
    },
    ...stories.meta.argTypes,
    className: {
      control: false,
      description: 'Additional CSS classes applied to the nav element.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description: 'Inline styles applied to the nav element. Prefer className with gi-* Tailwind utilities.',
      table: { type: { summary: 'React.CSSProperties' } },
    },
  },
  parameters: {
    ...stories.meta.parameters,
    docs: {
      ...stories.meta.parameters.docs,
      description: {
        ...stories.meta.parameters.docs.description,
        component: `The recommended, flexible way to build pagination. You put the control together from its parts, so you choose the labels, icons, which pages appear, and whether each page is a link or a button. It replaces the all-in-one \`Pagination\` from the main entry point.\n\n${stories.meta.parameters.docs.description.component}\n\nThe parts are \`PaginationLink\`, \`PaginationButton\` and \`PaginationEllipsis\`. Place them directly inside \`Pagination\`.\n\n${importNext('Pagination')}`,
      },
    },
  },
} as Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  ...stories.Default,
  parameters: {
    docs: {
      source: {
        type: 'code',
        transform: extractRenderBody,
      },
    },
  },
  render: function Render(props) {
    const [currentPage, setCurrentPage] = useState(5);
    const pages = getPaginationList({ current: currentPage, total: 10, size: 7 });
    return (
      <Pagination {...props}>
        <PaginationButton
          className="gi-flex gi-gap-2"
          onClick={() => {
            setCurrentPage((current) => current - 1);
          }}
          disabled={currentPage === 1}
        >
          <ArrowBackward />
          Previous
        </PaginationButton>
        {pages.map((page, index) =>
          page === -1 ? (
            <PaginationEllipsis key={`${index}-ellipsis`} />
          ) : (
            <PaginationButton
              key={page}
              current={page === currentPage}
              onClick={(event) => {
                event.preventDefault();
                setCurrentPage(page);
              }}
            >
              {page}
            </PaginationButton>
          ),
        )}
        <PaginationButton
          className="gi-flex gi-gap-2"
          onClick={() => {
            setCurrentPage((current) => current + 1);
          }}
          disabled={currentPage === 10}
        >
          Next
          <ArrowForward />
        </PaginationButton>
      </Pagination>
    );
  },
};

export const PaginationList: Story = {
  ...stories.PaginationList,
  parameters: {
    docs: {
      ...stories.PaginationList.parameters.docs,
      source: {
        type: 'code',
        transform: extractRenderBody,
      },
    },
  },
  render: function Render() {
    const total = 10;
    const size = 7;
    const currentPages = [1, 5, total];

    return (
      <Stack align="center" gap={2}>
        {currentPages.map((currentPage) => {
          const pages = getPaginationList({ current: currentPage, total, size });

          return (
            <Pagination key={currentPage} ariaLabel={`Page ${currentPage} of ${total}`}>
              {currentPage === 1 ? (
                <PaginationButton disabled className="gi-flex gi-gap-2">
                  <ArrowBackward />
                  Previous
                </PaginationButton>
              ) : (
                <PaginationLink href="#" className="gi-flex gi-gap-2">
                  <ArrowBackward />
                  Previous
                </PaginationLink>
              )}
              {pages.map((page, index) =>
                page === -1 ? (
                  <PaginationEllipsis key={`${index}-ellipsis`} />
                ) : (
                  <PaginationLink href="#" key={page} current={page === currentPage}>
                    {page}
                  </PaginationLink>
                ),
              )}
              {currentPage === total ? (
                <PaginationButton disabled className="gi-flex gi-gap-2">
                  Next
                  <ArrowForward />
                </PaginationButton>
              ) : (
                <PaginationLink href="#" className="gi-flex gi-gap-2">
                  Next
                  <ArrowForward />
                </PaginationLink>
              )}
            </Pagination>
          );
        })}
      </Stack>
    );
  },
};

// Stand-in for a router link component such as Next.js `<Link>`.
const CustomLink = (props: React.ComponentProps<'a'>) => <a {...props} />;

const toPage = (page: number) => `?page=${page}`;

export const AsChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `asChild` on `PaginationLink` to render your own link component, such as Next.js `<Link>`, while keeping the pagination styles. Keep `current` and `ariaLabel` on `PaginationLink`, and put `href` and any router-specific props on the child.\n\nIn this example, `CustomLink` stands in for a router link such as Next.js `<Link>`. Previous and Next become disabled `PaginationButton`s on the first and last pages, because links have no disabled state.',
      },
      source: {
        type: 'code',
        transform: extractRenderBody,
      },
    },
  },
  render: function Render(props) {
    const total = 10;
    const [currentPage, setCurrentPage] = useState(5);
    const pages = getPaginationList({ current: currentPage, total, size: 7 });
    const navigate = (page: number) => (event: React.MouseEvent) => {
      event.preventDefault();
      setCurrentPage(page);
    };

    return (
      <Pagination {...props}>
        {currentPage === 1 ? (
          <PaginationButton disabled className="gi-flex gi-gap-2">
            <ArrowBackward />
            Previous
          </PaginationButton>
        ) : (
          <PaginationLink asChild className="gi-flex gi-gap-2">
            <CustomLink href={toPage(currentPage - 1)} onClick={navigate(currentPage - 1)}>
              <ArrowBackward />
              Previous
            </CustomLink>
          </PaginationLink>
        )}
        {pages.map((page, index) =>
          page === -1 ? (
            <PaginationEllipsis key={`${index}-ellipsis`} />
          ) : (
            <PaginationLink asChild key={page} current={page === currentPage} ariaLabel={`Go to page ${page}`}>
              <CustomLink href={toPage(page)} onClick={navigate(page)}>
                {page}
              </CustomLink>
            </PaginationLink>
          ),
        )}
        {currentPage === total ? (
          <PaginationButton disabled className="gi-flex gi-gap-2">
            Next
            <ArrowForward />
          </PaginationButton>
        ) : (
          <PaginationLink asChild className="gi-flex gi-gap-2">
            <CustomLink href={toPage(currentPage + 1)} onClick={navigate(currentPage + 1)}>
              Next
              <ArrowForward />
            </CustomLink>
          </PaginationLink>
        )}
      </Pagination>
    );
  },
  play: async ({ canvas, step }) => {
    await step('renders the custom links with pagination semantics', async () => {
      const current = canvas.getByRole('link', { name: 'Go to page 5' });
      expect(current).toHaveAttribute('href', '?page=5');
      expect(current).toHaveAttribute('aria-current', 'page');
      expect(current.parentElement?.tagName).toBe('LI');
    });

    await step('navigates client-side when a page link is clicked', async () => {
      await userEvent.click(canvas.getByRole('link', { name: 'Go to page 6' }));
      expect(canvas.getByRole('link', { name: 'Go to page 6' })).toHaveAttribute('aria-current', 'page');
      expect(canvas.getByRole('link', { name: 'Go to page 5' })).not.toHaveAttribute('aria-current');
    });

    await step('navigates with the Previous and Next links', async () => {
      await userEvent.click(canvas.getByRole('link', { name: /Next/ }));
      expect(canvas.getByRole('link', { name: 'Go to page 7' })).toHaveAttribute('aria-current', 'page');
      await userEvent.click(canvas.getByRole('link', { name: /Previous/ }));
      expect(canvas.getByRole('link', { name: 'Go to page 6' })).toHaveAttribute('aria-current', 'page');
    });
  },
};
