<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_contact_message_can_be_stored(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'Usuario de prueba',
            'email' => 'usuario@example.com',
            'subject' => 'Consulta general',
            'message' => 'Este es un mensaje de prueba para validar el formulario de contacto.',
        ]);

        $response->assertRedirect(route('contact'));

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Usuario de prueba',
            'email' => 'usuario@example.com',
            'subject' => 'Consulta general',
        ]);
    }

    public function test_an_admin_can_view_contact_messages_dashboard(): void
    {
        $role = Role::query()->create([
            'name' => 'Administrador',
            'slug' => 'admin',
        ]);

        $user = User::factory()->create([
            'role_id' => $role->id,
        ]);

        $response = $this->actingAs($user)->get(route('contact-messages.index'));

        $response->assertOk();
    }
}
