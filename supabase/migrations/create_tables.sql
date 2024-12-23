-- Create the global_counter table
create table global_counter (
  id uuid primary key default uuid_generate_v4(),
  attempts integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create the tasks table
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert initial record into global_counter
insert into global_counter (attempts) values (0);

-- Insert sample task
insert into tasks (content) values ('Initial neural matrix challenge'); 