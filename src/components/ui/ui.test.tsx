import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import type { LucideIcon } from 'lucide-react';

const TestIcon = () => <span data-testid="icon">Icon</span>;
const StatIcon = () => <span data-testid="stat-icon">Icon</span>;
const EmptyIcon = () => <span data-testid="empty-icon">Icon</span>;

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies hover class when hover prop is true', () => {
    const { container } = render(<Card hover>Hover Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('hover:');
  });

  it('applies click handler when onClick prop is provided', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not apply hover class when hover prop is false', () => {
    render(<Card>Normal Card</Card>);
    const card = screen.getByText('Normal Card').parentElement;
    expect(card?.className).not.toContain('hover:');
  });
});

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Test Label" value={42} icon={StatIcon as any} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<StatCard label="Test" value={1} icon={StatIcon as any} />);
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('renders as link when href is provided', () => {
    render(<StatCard label="Test" value={1} icon={StatIcon as any} href="/test" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders as div when href is not provided', () => {
    render(<StatCard label="Test" value={1} icon={StatIcon as any} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('handles zero value', () => {
    render(<StatCard label="Test" value={0} icon={StatIcon as any} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles large value', () => {
    render(<StatCard label="Test" value={999999} icon={StatIcon as any} />);
    expect(screen.getByText('999999')).toBeInTheDocument();
  });

  it('handles negative value', () => {
    render(<StatCard label="Test" value={-5} icon={StatIcon as any} />);
    expect(screen.getByText('-5')).toBeInTheDocument();
  });

  it('calls onClick when provided', () => {
    const handleClick = jest.fn();
    render(<StatCard label="Test" value={1} icon={StatIcon as any} onClick={handleClick} />);
    fireEvent.click(screen.getByText('Test').closest('div')!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('StatusBadge', () => {
  it('renders status text', () => {
    render(<StatusBadge status="CONFIRMED" />);
    expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
  });

  it('renders with correct styling for PENDING', () => {
    render(<StatusBadge status="PENDING" />);
    const badge = screen.getByText('PENDING');
    expect(badge.className).toContain('bg-warning/10');
  });

  it('renders with correct styling for CONFIRMED', () => {
    render(<StatusBadge status="CONFIRMED" />);
    const badge = screen.getByText('CONFIRMED');
    expect(badge.className).toContain('bg-success/10');
  });

  it('renders with correct styling for CANCELLED', () => {
    render(<StatusBadge status="CANCELLED" />);
    const badge = screen.getByText('CANCELLED');
    expect(badge.className).toContain('bg-danger/10');
  });

  it('renders with default styling for unknown status', () => {
    render(<StatusBadge status="UNKNOWN" />);
    const badge = screen.getByText('UNKNOWN');
    expect(badge.className).toContain('bg-surface-20');
  });

  it('handles empty status', () => {
    const { container } = render(<StatusBadge status="" />);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-surface-20');
  });

  it('handles null status', () => {
    const { container } = render(<StatusBadge status={null as any} />);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-surface-20');
  });

  it('handles undefined status', () => {
    const { container } = render(<StatusBadge status={undefined as any} />);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-surface-20');
  });

  it('is case insensitive', () => {
    render(<StatusBadge status="confirmed" />);
    const badge = screen.getByText('confirmed');
    expect(badge.className).toContain('bg-success/10');
  });
});

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading text when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes for danger', () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-danger');
  });

  it('applies variant classes for success', () => {
    render(<Button variant="success">Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-success');
  });

  it('applies size classes for sm', () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('px-3');
  });

  it('applies full width class when fullWidth', () => {
    render(<Button fullWidth>Full</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('w-full');
  });

  it('renders as button element', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies type submit when specified', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});

describe('Input', () => {
  it('renders label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders with value', () => {
    render(<Input label="Name" value="John" onChange={() => {}} />);
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input label="Name" value="" onChange={handleChange} />);
    const input = document.querySelector('input');
    fireEvent.change(input!, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders as required when required prop is true', () => {
    render(<Input label="Email" required />);
    const input = document.querySelector('input');
    expect(input).toBeRequired();
  });

  it('renders with correct input type', () => {
    render(<Input label="Password" type="password" />);
    const input = document.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders with number type', () => {
    render(<Input label="Age" type="number" />);
    const input = document.querySelector('input');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('handles empty value', () => {
    render(<Input label="Name" value="" onChange={() => {}} />);
    const input = document.querySelector('input');
    expect(input).toHaveValue('');
  });

  it('handles disabled state', () => {
    render(<Input label="Name" disabled />);
    const input = document.querySelector('input');
    expect(input).toBeDisabled();
  });
});

describe('Textarea', () => {
  it('renders label', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders with value', () => {
    render(<Textarea label="Notes" value="Some notes" onChange={() => {}} />);
    expect(screen.getByDisplayValue('Some notes')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Textarea label="Notes" value="" onChange={handleChange} />);
    const textarea = document.querySelector('textarea');
    fireEvent.change(textarea!, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('handles disabled state', () => {
    render(<Textarea label="Notes" disabled />);
    const textarea = document.querySelector('textarea');
    expect(textarea).toBeDisabled();
  });
});

describe('Select', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  it('renders label', () => {
    render(<Select label="Choose" options={options} value="" onChange={() => {}} />);
    expect(screen.getByText('Choose')).toBeInTheDocument();
  });

  it('renders options', () => {
    render(<Select label="Choose" options={options} value="" onChange={() => {}} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const handleChange = jest.fn();
    render(<Select label="Choose" options={options} value="" onChange={handleChange} />);
    const select = document.querySelector('select');
    fireEvent.change(select!, { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Select label="Choose" options={options} value="" onChange={() => {}} disabled />);
    const select = document.querySelector('select');
    expect(select).toBeDisabled();
  });

  it('handles empty options array', () => {
    render(<Select label="Choose" options={[]} value="" onChange={() => {}} />);
    expect(screen.getByText('Choose')).toBeInTheDocument();
  });

  it('handles single option', () => {
    render(<Select label="Choose" options={[{ value: '1', label: 'Only' }]} value="" onChange={() => {}} />);
    expect(screen.getByText('Only')).toBeInTheDocument();
  });

  it('handles many options', () => {
    const manyOptions = Array.from({ length: 100 }, (_, i) => ({ value: String(i), label: `Option ${i}` }));
    render(<Select label="Choose" options={manyOptions} value="" onChange={() => {}} />);
    expect(screen.getByText('Option 0')).toBeInTheDocument();
    expect(screen.getByText('Option 99')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No data" icon={EmptyIcon as any} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon={EmptyIcon as any} />);
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<EmptyState title="Empty" icon={EmptyIcon as any} action={<button>Do Something</button>} />);
    expect(screen.getByText('Do Something')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="Empty" icon={EmptyIcon as any} />);
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    render(<EmptyState title="Empty" icon={EmptyIcon as any} />);
    expect(screen.queryByText('Do Something')).not.toBeInTheDocument();
  });
});

describe('LoadingState', () => {
  it('renders default loading text', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom loading text', () => {
    render(<LoadingState text="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders centered content', () => {
    const { container } = render(<LoadingState />);
    expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
