import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import MenuItem from '../components/MenuItem';

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

// Test 1
test('renders_page_title_and_nav_links', () => {
  const { container } = render(<App />);

  const title = container.querySelector('#page-title');
  expect(title).toBeInTheDocument();
  expect(title.textContent).toBe('BrewPoint Order Counter');

  expect(container.querySelector('#main-nav')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Menu' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Summary' })).toBeInTheDocument();
});

// Test 2
test('renders_all_menu_rows_with_props', () => {
  const { container } = render(<App />);

  expect(container.querySelector('#menu-list')).toBeInTheDocument();

  const rows = container.querySelectorAll('.menu-row');
  expect(rows.length).toBe(3);

  const names = Array.from(container.querySelectorAll('.item-name')).map((el) =>
    el.textContent.trim()
  );
  expect(names).toEqual(['Espresso', 'Cold Brew', 'Cappuccino']);
});

// Test 3
test('renders_category_and_price_with_exact_labels', () => {
  const { container } = render(<App />);

  const categories = Array.from(container.querySelectorAll('.item-category')).map((el) =>
    el.textContent.trim()
  );
  const prices = Array.from(container.querySelectorAll('.item-price')).map((el) =>
    el.textContent.trim()
  );

  expect(categories).toEqual(['Category: Hot', 'Category: Cold', 'Category: Hot']);
  expect(prices).toEqual(['Price: $120', 'Price: $180', 'Price: $150']);
});

// Test 4
test('shows_zero_quantity_and_zero_total_initially', () => {
  const { container } = render(<App />);

  const quantities = container.querySelectorAll('.qty-value');
  expect(quantities.length).toBe(3);
  quantities.forEach((qty) => {
    expect(qty.textContent.trim()).toBe('0');
  });

  expect(container.querySelector('#total-items').textContent.trim()).toBe('Total Items: 0');
});

// Test 5
test('increases_quantity_on_plus_click', () => {
  const { container } = render(<App />);

  fireEvent.click(container.querySelectorAll('.increase-btn')[0]);
  expect(container.querySelectorAll('.qty-value')[0].textContent.trim()).toBe('1');

  fireEvent.click(container.querySelectorAll('.increase-btn')[0]);
  expect(container.querySelectorAll('.qty-value')[0].textContent.trim()).toBe('2');

  expect(container.querySelectorAll('.qty-value')[1].textContent.trim()).toBe('0');
  expect(container.querySelectorAll('.qty-value')[2].textContent.trim()).toBe('0');
});

// Test 6
test('decreases_quantity_and_never_goes_below_zero', () => {
  const { container } = render(<App />);

  fireEvent.click(container.querySelectorAll('.increase-btn')[1]);
  fireEvent.click(container.querySelectorAll('.increase-btn')[1]);
  expect(container.querySelectorAll('.qty-value')[1].textContent.trim()).toBe('2');

  fireEvent.click(container.querySelectorAll('.decrease-btn')[1]);
  expect(container.querySelectorAll('.qty-value')[1].textContent.trim()).toBe('1');

  fireEvent.click(container.querySelectorAll('.decrease-btn')[1]);
  expect(container.querySelectorAll('.qty-value')[1].textContent.trim()).toBe('0');

  fireEvent.click(container.querySelectorAll('.decrease-btn')[1]);
  expect(container.querySelectorAll('.qty-value')[1].textContent.trim()).toBe('0');
  expect(container.querySelector('#total-items').textContent.trim()).toBe('Total Items: 0');
});

// Test 7
test('updates_total_items_count_in_header', () => {
  const { container } = render(<App />);

  fireEvent.click(container.querySelectorAll('.increase-btn')[0]);
  expect(container.querySelector('#total-items').textContent.trim()).toBe('Total Items: 1');

  fireEvent.click(container.querySelectorAll('.increase-btn')[2]);
  expect(container.querySelector('#total-items').textContent.trim()).toBe('Total Items: 2');

  fireEvent.click(container.querySelectorAll('.increase-btn')[2]);
  expect(container.querySelector('#total-items').textContent.trim()).toBe('Total Items: 3');
});

// Test 8
test('logs_total_items_change_using_useEffect', async () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const { container } = render(<App />);

  const wasLogged = (message) =>
    logSpy.mock.calls.some((call) => String(call[0]).includes(message));

  expect(wasLogged('Total items in cart: 0')).toBe(true);

  fireEvent.click(container.querySelectorAll('.increase-btn')[0]);

  await waitFor(() => {
    expect(wasLogged('Total items in cart: 1')).toBe(true);
  });

  logSpy.mockRestore();
});

// Test 9
test('validates_menu_item_props_with_proptypes', () => {
  expect(MenuItem.propTypes).toBeDefined();
  expect(typeof MenuItem.propTypes.itemName).toBe('function');
  expect(typeof MenuItem.propTypes.category).toBe('function');
  expect(typeof MenuItem.propTypes.price).toBe('function');
  expect(typeof MenuItem.propTypes.quantity).toBe('function');
  expect(typeof MenuItem.propTypes.onIncrease).toBe('function');
  expect(typeof MenuItem.propTypes.onDecrease).toBe('function');

  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(<MenuItem />);

  expect(errorSpy).toHaveBeenCalled();

  errorSpy.mockRestore();
});

// Test 10
test('shows_order_summary_with_total_amount_on_summary_route', async () => {
  const { container } = render(<App />);

  fireEvent.click(container.querySelectorAll('.increase-btn')[0]);
  fireEvent.click(container.querySelectorAll('.increase-btn')[0]);
  fireEvent.click(container.querySelectorAll('.increase-btn')[1]);

  fireEvent.click(screen.getByRole('link', { name: 'Summary' }));

  await waitFor(() => {
    expect(container.querySelector('#order-summary')).toBeInTheDocument();
  });

  expect(container.querySelector('#summary-title').textContent.trim()).toBe('Order Summary');

  const summaryRows = Array.from(container.querySelectorAll('.summary-row')).map((el) =>
    el.textContent.replace(/\s+/g, ' ').trim()
  );
  expect(summaryRows).toEqual(['Espresso x 2 = $240', 'Cold Brew x 1 = $180']);

  expect(container.querySelector('#total-amount').textContent.trim()).toBe('Total Amount: $420');
  expect(container.querySelectorAll('.menu-row').length).toBe(0);
});
