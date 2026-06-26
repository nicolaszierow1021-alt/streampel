import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json({ media: data || [] });
  } catch (error) {
    console.error("Error reading media from Supabase:", error);
    return NextResponse.json({ media: [] });
  }
}

export async function POST(request: Request) {
  try {
    const newItem = await request.json();
    
    // Check if item already exists
    const { data: existing } = await supabase
      .from('media')
      .select('id')
      .eq('id', newItem.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Item already exists' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('media')
      .insert([newItem])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    console.error("Error writing to Supabase:", error);
    return NextResponse.json({ error: 'Failed to save item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting from Supabase:", error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedItem = await request.json();
    
    if (!updatedItem.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('media')
      .update(updatedItem)
      .eq('id', updatedItem.id)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    console.error("Error updating in Supabase:", error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
